import CorasEmbed from '../components/coras-embed';

<template>
  {{! One persistent mount serves the landing page and every child route. The }}
  {{! mounted app reads the URL and renders the matching page in place, so the }}
  {{! child routes need no template of their own. }}
  <CorasEmbed />
  {{outlet}}
</template>
