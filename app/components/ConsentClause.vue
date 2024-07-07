<template>
    <span class="w-full lg:w-1/2 text-justify">
        <u class="uppercase">
            <b>
                <slot name="title"></slot>
            </b>
        </u>
        <slot></slot>
        <slot name="input"></slot>
    </span>

</template>
