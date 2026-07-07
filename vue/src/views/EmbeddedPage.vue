<script setup lang="ts">
// Each page (landing, search, details) is rendered by the single persistent
// mount in the parent layout, not here. This component exists only so the route
// has a target: it gives every page a real, deep-linkable URL under
// `/:locale/:currency` while the layout stays mounted across the switch.
</script>

<template></template>
