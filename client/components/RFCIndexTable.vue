<template>
  <Table>
    <thead>
      <tr>
        <th><abbr title="Number">Num</abbr></th>
        <th>Information</th>
      </tr>
    </thead>
    <tbody>
      <TableRow v-if="props.isExample" key="example">
        <td>#####</td>
        <td>
          <h2 class="inline font-inherit">title</h2>
          <p>
            Title of RFC Author list [ Month Year ] (Format) (Obsoletes xxxx)
            (Obsoleted-By xxxx) (Updates xxxx) (Updated-By xxxx) (Also zzz##)
            (Status: status) (Stream: stream) (DOI: doi) <br /><br />

            or ##### Not Issued.
          </p>
        </td>
      </TableRow>
      <TableRow
        v-else
        v-for="rfcSummary in rfcSummaries"
        :key="rfcSummary.number.toString()"
      >
        <td>
          <a :href="rfcPathBuilder(`rfc${rfcSummary.number}`)">
            {{ rfcSummary.number }}
          </a>
        </td>
        <td>
          <h2 class="inline font-inherit">
            {{ rfcSummary.heading }}
          </h2>
          <p>
            <Renderable :val="rfcSummary.body" />
          </p>
        </td>
      </TableRow>
    </tbody>
  </Table>
</template>

<script setup lang="ts">
import { rfcPathBuilder } from '~/utilities/url'

type RfcSummary = { number: number; heading: string; body: VNode }

type Props = {
  rfcSummaries: RfcSummary[]
  isExample?: boolean
}

const props = defineProps<Props>()
</script>
