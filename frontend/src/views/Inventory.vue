<template>
<div id="HI">
  <v-app id="dayspan" v-cloak>
    <ds-calendar-app ref="app" :calendar="calendar" 
    @saved="updateEvent"
    @event-remove="removeEvent"
    @change="saveState">

      <template
        slot="eventDetailsBusy"
        slot-scope="{ details }"
      >
        <v-select
          single-line
          hide-details
          solo
          flat
          :items="size"
          prepend-icon="group"
          placeholder="Max Number of Reservations per 15 minutes"
          v-model="details.size"
        ></v-select>
      </template>

    </ds-calendar-app>
  </v-app>
</div>
</template>

<script>
import { Calendar } from 'dayspan';
import axios from 'axios';
import moment from 'moment';


export default {
  name: 'Inventory',

  data: () => ({
    calendar: Calendar.weeks(),
    size: Array.from(Array(20).keys()),
    readOnly: false,
  }),

  async mounted() {
    try {
      const inventory = await axios.get('http://localhost:9090/inventory');
      this.loadState(inventory.data);
    } catch (error) {
      console.error(error)
    }
  },

  methods:
  {
    updateEvent($event) {
      const schedule = $event.schedule.toInput();
      const inventory = {
        id: $event.details.id,
        description : $event.details.description,
        size : $event.details.size,
        color : $event.details.color,
        title : $event.details.title,
        dayOfMonth: schedule.dayOfMonth || null,
        dayOfWeek: schedule.dayOfWeek || null,
        duration: schedule.duration || null,
        durationUnit: schedule.durationUnit || null,
        month: schedule.month || null,
        times: schedule.times  || null,
        year: schedule.year  || null,
        exclude: schedule.exclude || null,
        start: schedule.start || null,
        end: schedule.end || null
      }
      axios.post('http://localhost:9090/inventory', inventory);
    },
    removeEvent($event) {
      axios.delete('http://localhost:9090/inventory/' + $event.data.id);
    },
    saveState()
    {
      const state = this.calendar.toInput(true);
      const json = JSON.stringify(state);

      localStorage.setItem(this.storeKey, json);
    },

    loadState(inventory)
    {
      let state = {};
      try
      {
        const savedState = JSON.parse(localStorage.getItem(this.storeKey));

        if (savedState)
        {
          state = savedState;
          state.preferToday = false;
        }
      }
      catch (e)
      {
        console.log( e );
      }

      state.events = inventory.map(item => {
        return {
          data: {
            id: item.id,
            title: item.title,
            color: item.color,
            forecolor: '#ffffff',
            size: item.size
          },
          schedule: {
            times: item.times,
            duration: item.duration,
            durationUnit: item.durationUnit,
            dayOfMonth: item.dayOfMonth,
            dayOfWeek: item.dayOfWeek,
            year: item.year,
            month: item.month,
            start: parseInt(item.start),
            end: parseInt(item.end),
            exclude: item.exclude 
          }
        }
      });

      this.$refs.app.setState( state );
    }
  }
}
</script>


<style>
body, html, #app, #dayspan {
  font-family: Roboto, sans-serif;
}
.application--wrap {
    min-height: calc(100vh - 124px) !important;
}
.v-toolbar--fixed, .v-toolbar--absolute {
    top: auto !important;
}
.v-navigation-drawer {
    top: auto !important;
}
.ds-month-view .ds-calendar-event {
    position: inherit !important;
    width: 100% !important;
}
</style>
