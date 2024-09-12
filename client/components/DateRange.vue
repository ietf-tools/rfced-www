<template>
  <div class="relative">
    <DatePicker.Root selection-mode="range" :min="OLDEST_RFC" :max="NEWEST_RFC">
      <fieldset>
        <legend class="font-bold">
          {{ props.label }}
        </legend>

        <div
          class="inline-flex contents-end border border-gray-300 rounded-2xl p-1"
        >
          <DatePicker.Control class="flex contents-center">
            <DatePicker.Input
              :index="0"
              class="w-[8em] rounded-l-xl border-r-gray bg-white text-black dark:bg-black dark:text-white"
            />
            <DatePicker.Input
              :index="1"
              class="w-[8em] rounded-r-xl border-l-0 bg-white text-black dark:bg-black dark:text-white"
            />
            <DatePicker.Trigger class="text-3xl align-center"
              >📅</DatePicker.Trigger
            >
            <DatePicker.ClearTrigger
              class="text-black dark:text-white ml-4 mr-2"
            >
              <GraphicsClose />
            </DatePicker.ClearTrigger>
          </DatePicker.Control>
        </div>
      </fieldset>
      <DatePicker.Positioner style="--z-index: 100" class="absolute z-50">
        <DatePicker.Content
          class="bg-white dark:bg-black border border-black dark:border-white p-3 rounded box-shadow"
        >
          <DatePicker.YearSelect
            class="bg-white text-black dark:bg-black dark:text-white"
          />
          <DatePicker.MonthSelect
            class="bg-white text-black dark:bg-black dark:text-white"
          />
          <DatePicker.View view="day">
            <DatePicker.Context v-slot="api">
              <DatePicker.ViewControl class="flex justify-between">
                <DatePicker.PrevTrigger>Prev</DatePicker.PrevTrigger>
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger>Next</DatePicker.NextTrigger>
              </DatePicker.ViewControl>
              <DatePicker.Table class="w-full border">
                <DatePicker.TableHead>
                  <DatePicker.TableRow>
                    <DatePicker.TableHeader
                      v-for="(weekDay, id) in api.weekDays"
                      :key="id"
                    >
                      {{ weekDay.short }}
                    </DatePicker.TableHeader>
                  </DatePicker.TableRow>
                </DatePicker.TableHead>
                <DatePicker.TableBody>
                  <DatePicker.TableRow
                    v-for="(week, weekId) in api.weeks"
                    :key="weekId"
                  >
                    <DatePicker.TableCell
                      v-for="(day, dayId) in week"
                      :key="dayId"
                      :value="day"
                      class="text-center"
                    >
                      <DatePicker.TableCellTrigger>
                        {{ day.day }}
                      </DatePicker.TableCellTrigger>
                    </DatePicker.TableCell>
                  </DatePicker.TableRow>
                </DatePicker.TableBody>
              </DatePicker.Table>
            </DatePicker.Context>
          </DatePicker.View>
          <DatePicker.View view="month">
            <DatePicker.Context v-slot="api">
              <DatePicker.ViewControl class="flex justify-between">
                <DatePicker.PrevTrigger>Prev</DatePicker.PrevTrigger>
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger>Next</DatePicker.NextTrigger>
              </DatePicker.ViewControl>
              <DatePicker.Table class="w-full">
                <DatePicker.TableBody>
                  <DatePicker.TableRow
                    v-for="(months, monthShortId) in api.getMonthsGrid({
                      columns: 4,
                      format: 'short'
                    })"
                    :key="monthShortId"
                  >
                    <DatePicker.TableCell
                      v-for="(month, monthId) in months"
                      :key="monthId"
                      :value="month.value"
                      class="text-center"
                    >
                      <DatePicker.TableCellTrigger>
                        {{ month.label }}
                      </DatePicker.TableCellTrigger>
                    </DatePicker.TableCell>
                  </DatePicker.TableRow>
                </DatePicker.TableBody>
              </DatePicker.Table>
            </DatePicker.Context>
          </DatePicker.View>
          <DatePicker.View view="year">
            <DatePicker.Context v-slot="api">
              <DatePicker.ViewControl class="flex justify-between">
                <DatePicker.PrevTrigger>Prev</DatePicker.PrevTrigger>
                <DatePicker.ViewTrigger>
                  <DatePicker.RangeText />
                </DatePicker.ViewTrigger>
                <DatePicker.NextTrigger>Next</DatePicker.NextTrigger>
              </DatePicker.ViewControl>
              <DatePicker.Table class="w-full">
                <DatePicker.TableBody>
                  <DatePicker.TableRow
                    v-for="(years, yearShortId) in api.getYearsGrid({
                      columns: 4
                    })"
                    :key="yearShortId"
                  >
                    <DatePicker.TableCell
                      v-for="(year, yearId) in years"
                      :key="yearId"
                      :value="year.value"
                      class="text-center"
                    >
                      <DatePicker.TableCellTrigger
                        class="hover:bg-blue-900 hover:text-white rounded py-2 px-1"
                      >
                        {{ year.label }}
                      </DatePicker.TableCellTrigger>
                    </DatePicker.TableCell>
                  </DatePicker.TableRow>
                </DatePicker.TableBody>
              </DatePicker.Table>
            </DatePicker.Context>
          </DatePicker.View>
        </DatePicker.Content>
      </DatePicker.Positioner>
    </DatePicker.Root>
  </div>
</template>

<script setup lang="ts">
import { DatePicker } from '@ark-ui/vue'

const OLDEST_RFC = '1969-01-01'

const NEWEST_RFC = new Date().toISOString().split('T')[0]

type Props = {
  label: string
  startLabel: string
  endLabel: string
  startModel: Date | null
  endModel: Date | null
}

const props = defineProps<Props>()

function handleExit(...args: unknown[]) {
  console.log(args)
  alert(args)
}
</script>

<style>
[data-range-start] {
  background-color: #058;
  color: #fff;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}

[data-in-range] {
  background-color: #058;
  color: #fff;
}

[data-range-end] {
  background-color: #058;
  color: #fff;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}

[data-disabled] {
  opacity: 0.3;
}
</style>
