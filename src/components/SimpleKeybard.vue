<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";

export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String
    },
    input: {
      type: String
    }
  },
  data: () => ({
    keyboard: null
  }),
  mounted() {
    this.keyboard = new Keyboard({
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      preventMouseDownDefault: false,
      layout: {
        'default' : [
            /* ா    ி    ீ    ு    ூ    ெ   ்        ே    ை    ொ    ோ    ௌ    ஃ  */
            "\u0BBE \u0BBF \u0BC0 \u0BC1 \u0bcd \u0BC2 \u0BC6 \u0BC7 \u0BC8 \u0BCA \u0BCB \u0BCC \u0B83",
            /*      ஆ     ஈ      ஊ     ஐ    ஏ      ள      ற     ன     ட      ண   ச      ஞ   \   */
            "\u0bb7 \u0b86 \u0b88 \u0b8a \u0b90 \u0b8f \u0bb3 \u0bb1 \u0ba9 \u0b9f \u0ba3 \u0b9a \u0b9e",
            /*  அ    இ                          உ      எ      க      ப    ம      த      ந      ய  */
            "\u0b85 \u0b87 \u0b9C \u0bb8 \u0bb9 \u0b89 \u0b8e \u0b95 \u0baa \u0bae \u0ba4 \u0ba8 \u0baf",
            /*         ஔ    ஒ      ஓ    வ     ங     ல      ர    , . ழ    */
            "{shift} \u0b94 \u0b93 \u0b92 \u0bb5 \u0b99 \u0bb2 \u0bb0 , . \u0bb4",
            "{cancel} {space} {enter}"
        ],
        'shift' : [
            /* numeric key row */
            "`      1      2       3      4     5     6   7  8  9  0 -  =  {bksp}",
            /* sanskrit row */
            /*     ஸ      ஷ        ஜ      ஹ           ஶ்ரீ                       க்ஷ                       */
            "{tab} \u0bb8  \u0bb7  \u0b9c   \u0bb9  \u0bb6\u0bcd\u0bb0\u0bc0  \u0b95\u0bcd\u0bb7 \u0020  [ ]  { } ",
            /* ௹     ௺    ௸     ஃ  \u0020 \u0020 \u0020 \" : ; \' {enter} */
            "\u0bf9 \u0bfa \u0bf8 \u0b83 \u0020 \u0020 \u0020 \" : ; \' {enter}",
            /* ௳ ௴ ௵ ௶ ௷ */
            "{shift} \u0bf3 \u0bf4 \u0bf5 \u0bf6 \u0bf7 \u0020 / \u0020 \u0020 /",
            "{space} {alt} {cancel}"
        ]
      },
      display: {
        '{cancel}': 'Clear',
        '{shift}': 'Shift',
        '{space}': 'Space',
        '{enter}': 'Back',
        '{bksp}': 'Bksp',
        '{tab}': 'Tab'
      }
    });      
  },

  methods: {
    onChange(input) {
      this.$emit("change", input);
    },
    onKeyPress(button) {
      this.$emit("keyPress", button);

      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    }
  },
  watch: {
    input(input) {
      this.keyboard.setInput(input);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>