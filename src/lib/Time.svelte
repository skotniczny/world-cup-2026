<script lang="ts">
  import { dateTimeFormatter } from "../intl"
  const { datetime }: { datetime: string } = $props()
</script>

<time {datetime}>{dateTimeFormatter(datetime)}</time>
