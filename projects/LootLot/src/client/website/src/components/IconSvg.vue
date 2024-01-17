<template>
    <div class="icon-svg">
        <svg class="iconSvg" aria-hidden="true">
            <use :xlink:href="iconName"/>
        </svg>
    </div>
</template>

<script>
    export default {
        name: "IconSvg",
        props: {
            iconName: {
                type: String,
                required: true
            }
        }
    }
</script>

<style scoped>
    .iconSvg {
        width: 2em;
        height: 2em;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
    }

</style>
