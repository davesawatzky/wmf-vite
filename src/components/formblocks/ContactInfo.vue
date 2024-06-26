<template>
  <form>
    <div class="grid grid-cols-12 gap-x-3 gap-y-1 items-end">
      <div v-if="!school" class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="contact.first_name"
          required
          name="first_name"
          type="text"
          label="First Name"
        />
      </div>
      <div
        v-if="!school && !schoolteacher && !teacher"
        class="col-span-12 sm:col-span-4"
      >
        <BaseInput
          v-model="contact.last_name"
          required
          name="last_name"
          type="text"
          label="Last Name"
        />
      </div>
      <div v-else-if="!school" class="col-span-12 sm:col-span-7">
        <BaseInput
          v-model="contact.last_name"
          required
          name="last_name"
          type="text"
          label="Last Name"
        />
      </div>
      <div
        v-if="!teacher && !school && !schoolteacher"
        class="col-span-12 sm:col-span-3"
      >
        <BaseInput
          v-model.number="contact.age"
          required
          name="age"
          type="number"
          :label="'Age on Dec. 31, ' + currentYear"
        />
      </div>
      <!-- <div v-else class="col-span-12 sm:col-span-3"></div> -->

      <div v-if="!schoolteacher && !school" class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model="contact.apartment"
          name="apartment"
          type="text"
          label="Apt."
        />
      </div>
      <div
        v-else-if="school && !schoolteacher"
        class="col-span-12 sm:col-span-4 mt-6 sm:mt-0"
      >
        <BaseInput
          v-model="contact.street_number"
          required
          name="street_number"
          type="text"
          label="Street Number"
        />
      </div>
      <div v-if="!schoolteacher && !school" class="col-span-6 sm:col-span-3">
        <BaseInput
          v-model="contact.street_number"
          required
          name="street_number"
          type="text"
          label="Street Number"
        />
      </div>

      <div v-if="school && !schoolteacher" class="col-span-12 sm:col-span-8">
        <BaseInput
          v-model="contact.street_name"
          requried
          name="street_name"
          type="text"
          label="Street Name"
        />
      </div>
      <div v-if="!school && !schoolteacher" class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model="contact.street_name"
          required
          name="street_name"
          type="text"
          label="Street Name"
        />
      </div>
      <div v-if="!schoolteacher" class="col-span-8 sm:col-span-7">
        <BaseInput
          v-model="contact.city"
          required
          name="city"
          type="text"
          label="City/Town"
        />
      </div>
      <div v-if="!schoolteacher" class="col-span-4 sm:col-span-2 self-start">
        <BaseSelect
          v-model="contact.province"
          required
          name="province"
          label="Province"
          :options="provinces"
        />
      </div>
      <div v-if="!schoolteacher" class="col-span-12 sm:col-span-3">
        <BaseInput
          v-model="contact.postal_code"
          v-maska
          required
          data-maska="A#A #A#"
          name="postal_code"
          type="text"
          label="Postal Code"
        />
      </div>
      <div class="col-span-12 sm:col-span-5">
        <BaseInput
          v-model="contact.phone"
          v-maska
          required
          data-maska="(###) ###-####"
          name="phone"
          type="tel"
          label="Phone Number"
        />
      </div>
      <div v-if="!school" class="col-span-12 sm:col-span-7">
        <BaseInput
          v-model="contact.email"
          required
          name="email"
          type="email"
          label="Email"
        />
      </div>
      <div v-if="groupperformer" class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model="contact.instrument"
          required
          name="instrument"
          type="text"
          label="Instrument"
        />
      </div>
      <div v-if="groupperformer" class="col-span-12 sm:col-span-6">
        <BaseInput
          v-model="contact.level"
          required
          name="level"
          type="text"
          label="Level"
        />
      </div>
      <div v-if="groupperformer" class="col-span-12">
        <BaseTextarea
          v-model="contact.other_classes"
          required
          name="other_classes"
          :label="textAreaLabel"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { provinces } from '@/composables/formData'
import { textAreaLabel } from '@/composables/formData'
import { useForm } from 'vee-validate'
import * as yup from 'yup'
import 'yup-phone-lite'

const currentYear = new Date().getFullYear()

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
  teacher: {
    type: Boolean,
    required: false,
  },
  schoolteacher: {
    type: Boolean,
    required: false,
  },
  school: {
    type: Boolean,
    required: false,
  },
  groupperformer: {
    type: Boolean,
    required: false,
  },
})
const emits = defineEmits(['update:modelValue'])

/**
 * Sets the model value from all the props.
 * Allows the 'BaseInput' components to set
 * the model value in props.
 */
const contact = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value),
})

const validationSchema = yup.object({
  first_name: yup.string().trim().required('First name is required'),
  last_name: yup.string().trim().required('Last name is required'),
  age: yup
    .number()
    .positive()
    .integer()
    .max(100)
    .nullable()
    .required('Indicate age'),
  apartment: yup
    .string()
    .notRequired()
    .trim()
    .nullable()
    .max(5, '5 characters maximum'),
  street_number: yup
    .string()
    .trim()
    .max(5, '5 characters maximum')
    .required('Enter a valid street number'),
  street_name: yup.string().trim().required('Enter a valid street name'),
  city: yup
    .string()
    .trim()
    .max(15, 'Too many characters')
    .required('Enter a city name'),
  province: yup.string().length(2),
  postal_code: yup
    .string()
    .matches(
      /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
      'Enter a valid postal code'
    )
    .required('Enter a valid postal code'),
  phone: yup
    .string()
    .phone('CA', 'Please enter a valid phone number')
    .required('A phone number is required'),
  email: yup
    .string()
    .email('Must be a valid email address')
    .required('Email address is required'),
})

useForm({
  validationSchema,
})
</script>

<style scoped></style>
