<template>
  <div class="md-layout">
    <md-card class="md-layout-item md-size-29 md-small-size-100">
      <form novalidate @submit.prevent="validateReservation">
      <md-card-header>
        <div class="md-title">Make a Reservation</div>
      </md-card-header>

      <md-card-content>
        <md-field :class="getValidationClass('name')">
          <label for="name">Name</label>
          <md-input type="name" name="name" id="name" v-model="form.name" :disabled="sending" />
          <span class="md-error" v-if="!$v.form.name.required">A name is required</span>
          <span class="md-error" v-else-if="!$v.form.name.minlength">Invalid name</span>
        </md-field>

        <md-field :class="getValidationClass('email')">
          <label for="email">Email</label>
          <md-input type="email" name="email" id="email" v-model="form.email" :disabled="sending" />
          <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
          <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
        </md-field>

        <md-field :class="getValidationClass('size')">
          <label for="size">Party Size</label>
          <md-select v-model="form.size" name="size" id="size" :disabled="sending" md-dense>
            <md-option value="1">1</md-option>
            <md-option value="2">2</md-option>
            <md-option value="3">3</md-option>
            <md-option value="4">4</md-option>
            <md-option value="5">5</md-option>
            <md-option value="6">6</md-option>
            <md-option value="7">7</md-option>
            <md-option value="8">8</md-option>
            <md-option value="9">9</md-option>
            <md-option value="10">10</md-option>
            <md-option value="11">11</md-option>
            <md-option value="12">12</md-option>
            <md-option value="13+">13+</md-option>
          </md-select>
          <span class="md-error" v-if="!$v.form.size.required">Party size is required</span>
        </md-field>

        <div :class="getValidationClass('date')">
          <md-datepicker v-model="selectedDate" :disabled="sending">
            <label>Select date</label>
          </md-datepicker>
          <!-- <span class="md-error" v-if="!$v.form.date.required">Date is required</span> -->
        </div>

        <div v-if="form.date">
          <md-field :class="getValidationClass('time')">
            <label for="time">Time</label>
            <md-select v-model="form.time" name="time" id="time" :disabled="sending" md-dense>
              <md-option :disabled="time.disabled" v-for="time in times" :value="time.militaryTime" :key="time.militaryTime"> {{ time.time }} {{ time.suffix }} </md-option>
            </md-select>
            <span class="md-error" v-if="!$v.form.time.required">Time is required</span>
          </md-field>
        </div>

      </md-card-content>

      <md-progress-bar md-mode="indeterminate" v-if="sending" />

      <md-card-actions>
        <md-button type="submit" class="md-primary" :disabled="sending">Create Reservation</md-button>
      </md-card-actions>
      </form>
    </md-card>

    <md-card class="md-layout-item md-size-50 md-small-size-100">
      <md-card-header class="inventory">
        <div class="md-title">Reservations / Availability</div>
         <md-datepicker v-model="selectedDate" :disabled="sending">
            <label>Select date</label>
          </md-datepicker>
      </md-card-header>

      <md-card-content>
        <div v-if="!currentInventory.empty && this.form.date">

        <div v-for="time in times" :key="time.militaryTime" >
          <div v-if="time.display" class="inventory-row">
            <md-card class="time">
              {{time.time}} {{time.suffix}}
            </md-card>
            <div v-for="reservation in time.reservations" :key="reservation.id">
              <md-card class="booked">
              Booked: {{reservation.size}}
              </md-card>
            </div>
            <div v-for="index in time.available" :key="index">
              <md-card class="open">
                <div v-on:click="setTime(time.militaryTime)">Open</div>
              </md-card>
            </div>
          </div>
        </div>
        </div>

        <md-empty-state
          v-if="currentInventory.empty || !this.form.date"
          md-icon="group"
          md-label="No Inventory"
          md-description="No inventory available for selected date.">
        </md-empty-state>
      </md-card-content>
    </md-card>

    <md-snackbar :md-active.sync="reservationSaved">{{ lastReservation }} was saved with success!</md-snackbar>
    <md-snackbar :md-active.sync="error">There was an error booking your reservation.  Please verify availability and try again.</md-snackbar>

  </div>
</template>

<script>
  import axios from 'axios'
  import { validationMixin } from 'vuelidate'
  import { CurrentInventory } from '../classes/CurrentInventoryClass'
  import {
    required,
    email,
    minLength,
    maxLength
  } from 'vuelidate/lib/validators'
  import moment from 'moment'

  const currentInventory = new CurrentInventory();

  export default {
    name: 'Reservations',
    mixins: [validationMixin],
    async mounted() {
      try {
        await axios.get('http://localhost:8080/inventory')
        this.times = this.currentInventory.inventory;
      } catch (error) {
        console.error(error)
      }
    },
    data: () => ({
      form: {
        name: null,
        email: null,
        size: null,
        date: null,
        time: null
      },
      times: [],
      currentInventory: currentInventory,
      reservationSaved: false,
      sending: false,
      lastReservation: null,
      selectedDate: null,
      lastDateSelection: null,
      error: null
    }),
    validations: {
      form: {
        name: {
          required,
          minLength: minLength(3)
        },
        email: {
          required,
          email
        },
        size: {
          required
        },
        date: {
          required
        },
        time: {
          required
        }
      }
    },
    watch: {
      selectedDate(val, oldVal) {
        this.form.date = val;
        const oldValTime = oldVal && moment(oldVal).format('YYYY-MM-DD');
        const valTime = val && moment(val).format('YYYY-MM-DD');
        if(oldValTime !== valTime) {
          currentInventory.clear();
          if(val) {
            const date = moment(this.form.date).format('YYYY-MM-DD');
            axios.get(`http://localhost:8080/inventory/${date}`).then(inventory => {
              axios.get(`http://localhost:8080/reservation/${date}`).then(reservations => {
                currentInventory.updateInventory(reservations.data, inventory.data);
              })
            });
          }
        }
      }
    },
    methods: {
      setTime(time){
        this.form.time = time;
      },
      getValidationClass (fieldName) {
        const field = this.$v.form[fieldName]

        if (field) {
          return {
            'md-invalid': field.$invalid && field.$dirty
          }
        }
      },
      clearForm () {
        this.$v.$reset()
        this.form.name = null;
        this.form.email = null;
        this.form.size = null;
        this.form.time = null;
      },
      saveReservation () {
        this.sending = true

        const reservation = {
          name: this.form.name,
          email: this.form.email,
          date: this.form.date,
          size: this.form.size,
          time: this.form.time
        }

        axios.post('http://localhost:8080/reservation', reservation).then(response => {
          if(response.status === 200) {
            reservation.id = response.data.id;
            this.lastReservation = `Successfully booked ${this.form.name} (${this.form.email}), party of ${this.form.size} at ${this.form.time} `
            this.reservationSaved = true
            currentInventory.addReservation(reservation);
          } else {
            this.error = true;
          }
          this.sending = false
          this.clearForm()
        });
      },
      validateReservation () {
        this.$v.$touch()

        if (!this.$v.$invalid && this.form.date) {
          this.saveReservation()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-layout {
    margin-top: 35px;
    margin-bottom: 35px;
  }
  .md-card {
    margin-bottom: 15px;
  }
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
  .inventory .md-datepicker {
    margin-bottom: 0px;
  }
  .inventory-row {
    display: flex;
    flex-direction: row;
    .md-card {
      padding: 4px 6px;
      margin: 5px;
      cursor: pointer;
    }
    .time {
      flex-basis: 75px;
      min-width: 75px;
      box-shadow: none;
      font-weight: bold;
    }
    .booked {
      background-color: #dcdcdc;
      flex-basis: 80px;
      min-width: 80px;
    }
    .open {
      flex-basis: 80px;
      min-width: 80px;
      color:white;
      background-color: #448aff;
    }
  }
</style>