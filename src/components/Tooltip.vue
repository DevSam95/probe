<template>
    <div class="tooltip">
        <v-tooltip :color="color" bottom>
            <template slot="activator">
                <slot name="content"></slot>
            </template>
            <span>{{ text }}</span>
        </v-tooltip>
    </div>
</template>

<script>
export default {
    props: {
        text: {
          type: String,
          default: ''
        },
        color: {
            type: String,
            default: undefined
        }
    }
};

</script>

<style>
.tooltip {
    align-self: center;
}
</style>