<script lang="ts">
  import './layout.css'
  import favicon from '$lib/assets/favicon.ico'

  let { children } = $props()
</script>

<svelte:head>
  <title>NSCards Wrapped</title>
  <meta name="description" content={'Quick yearly cards snapshot for a nation using Bazaar data.'} />
  <link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
