// See the Tailwind configuration guide for advanced usage
// https://tailwindcss.com/docs/configuration

const plugin = require("tailwindcss/plugin");
const fs = require("fs");
const path = require("path");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./js/**/*.js",
    "../lib/trivia_web.ex",
    "../lib/trivia_web/**/*.*ex",
  ],
  theme: {
    extend: {
      lineHeight: {
        normal: "180%",
      },
      letterSpacing: {
        normal: "-0.32px",
      },
      fontFamily: {
        mono: ["geist", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        black: "#000000",
        white: "#FFFFFF",
        lime: "#24FF00",
        highlight: {
          1: "hsla(0, 0%, 100%, 0.1)",
          2: "hsla(0, 0%, 100%, 0.15)",
        },
        orange: "hsla(22, 100%, 50%, 1)",
        purple: "hsla(306, 76%, 55%, 1)",
        gray: {
          1: "hsla(200, 7%, 9%, 1)",
          5: "hsla(200, 88%, 93%, 0.11)",
          6: "hsla(209, 94%, 94%, 0.14)",
          7: "hsla(203, 6%, 24%, 1)",
          10: "hsla(210, 100%, 95%, 0.47)",
          11: "hsla(210, 100%, 97%, 0.62)",
          12: "hsla(210, 100%, 100%, 0.93)",
        },
        light: {
          8: "hsla(204, 96%, 10%, 0.24)",
          10: "hsla(204, 100%, 5%, 0.51)",
          12: "hsla(202, 24%, 9%, 1)",
        },
        green: {
          5: "hsla(173, 100%, 50%, 0.14)",
          11: "hsla(167, 70%, 48%, 1)",
        },
        red: {
          5: "hsla(5, 48%, 17%, 1)",
          11: "hsla(0, 100%, 67%, 1)",
        },
        blue: {
          5: "hsla(225, 98%, 62%, 0.42)",
          11: "hsla(202, 67%, 51%, 1)",
        },
      },
      animation: {
        blink: "blink 1.45s infinite step-start",
        shake: "shake 0.52s cubic-bezier(.36,.07,.19,.97) both",
      },
      keyframes: {
        blink: {
          "0%, 25%, 100%": { opacity: "1" },
          "50%, 75%": { opacity: "0" },
        },
        shake: {
          "0%": {
            transform: "translateX(0)",
          },
          "6.5%": {
            transform: "translateX(-4px) rotateY(-9deg)",
          },
          "18.5%": {
            transform: "translateX(3px) rotateY(7deg)",
          },
          "31.5%": {
            transform: "translateX(-1px) rotateY(-5deg)",
          },
          "43.5%": {
            transform: "translateX(2px) rotateY(3deg)",
          },
          "50%": {
            transform: "translateX(0)",
          },
        },
      },
      borderColor: {
        DEFAULT: "hsla(203, 6%, 24%, 1)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    // Allows prefixing tailwind classes with LiveView classes to add rules
    // only when LiveView classes are applied, for example:
    //
    //     <div class="phx-click-loading:animate-ping">
    //
    plugin(({ addVariant }) =>
      addVariant("phx-click-loading", [
        ".phx-click-loading&",
        ".phx-click-loading &",
      ]),
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-submit-loading", [
        ".phx-submit-loading&",
        ".phx-submit-loading &",
      ]),
    ),
    plugin(({ addVariant }) =>
      addVariant("phx-change-loading", [
        ".phx-change-loading&",
        ".phx-change-loading &",
      ]),
    ),

    // Embeds Heroicons (https://heroicons.com) into your app.css bundle
    // See your `CoreComponents.icon/1` for more information.
    //
    plugin(function ({ matchComponents, theme }) {
      let iconsDir = path.join(__dirname, "../deps/heroicons/optimized");
      let values = {};
      let icons = [
        ["", "/24/outline"],
        ["-solid", "/24/solid"],
        ["-mini", "/20/solid"],
        ["-micro", "/16/solid"],
      ];
      icons.forEach(([suffix, dir]) => {
        fs.readdirSync(path.join(iconsDir, dir)).forEach((file) => {
          let name = path.basename(file, ".svg") + suffix;
          values[name] = { name, fullPath: path.join(iconsDir, dir, file) };
        });
      });
      matchComponents(
        {
          hero: ({ name, fullPath }) => {
            let content = fs
              .readFileSync(fullPath)
              .toString()
              .replace(/\r?\n|\r/g, "");
            let size = theme("spacing.6");
            if (name.endsWith("-mini")) {
              size = theme("spacing.5");
            } else if (name.endsWith("-micro")) {
              size = theme("spacing.4");
            }
            return {
              [`--hero-${name}`]: `url('data:image/svg+xml;utf8,${content}')`,
              "-webkit-mask": `var(--hero-${name})`,
              mask: `var(--hero-${name})`,
              "mask-repeat": "no-repeat",
              "background-color": "currentColor",
              "vertical-align": "middle",
              display: "inline-block",
              width: size,
              height: size,
            };
          },
        },
        { values },
      );
    }),
  ],
};
