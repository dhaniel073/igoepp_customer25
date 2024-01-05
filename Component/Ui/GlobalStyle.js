import { Dimensions, Platform, StatusBar } from "react-native";

export const marginStyle = {
    marginTp: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 50
}

export const FontSize = {
    size_sm:14
}

export const DIMENSION = {
    HEIGHT : Dimensions.get('window').height,
    WIDTH : Dimensions.get('window').width
}

export const TOKEN = `eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiOWFlYjQ5ZDdiN2RlMjM3ZTZjNGJkY2ExNTI1ZTdhNGM3NjY1MDM0NTg1MzhmMTg2MGVlMWI5ZWQ4NWUwNDMzNmFjMTlhYWZmZWE3OThiNjYiLCJpYXQiOjE2OTkwMTExODIsIm5iZiI6MTY5OTAxMTE4MiwiZXhwIjoxNzMwNjMzNTgyLCJzdWIiOiIxNTQiLCJzY29wZXMiOltdfQ.L7hyMSy0IU5C8APSG7K5A2cbjnvCye5-2tDc3ddjSOuPmWuo7760Xvp5FHbJJUt3HLMR-BQfgL8tFzee2AhswYvsgy0i6-nJbscurpzKXKitOU9g0vlRR1tWJL1BjXYitU1_gk4l54rur-0Mv_EiMxBP7SF3m56hMyRKJ_BUnxxiP7ZBBiSlp-My8y33tzJvVnR4f_m-ZIAuQvRepOmq_Kp9VzLIIVd42_MJG-2fzTKFaim5Swb__7t_QvKbtTA7dDVISJrccxioEoePmcIC2JS6Ik_pJtifRDNeaGJSsSWiVABfW0T_LYojHYCvu__Oc2FRUdb9fwpJmvkLbf8x7TNtmKGGvuz4xdzXAe6rFsSMgqMPtUzdQRmVJG-7xiqASvVEJ-YzDMUyaZu_IJIOoTevuSR08cMIxGnN_MEZV9VTXolQvT3QytPyYPkKbRSd1WtPurJnZVUQt9eQ-th-g9WzI_EpG9tVZecKTt9f_C9oQuvccAZaIyDStsn5CdDDYfWypsmWlsnPclaQ0aeBov-ohbkGrWOatDj9H7sRNonvzGDyYsWAFcFFS26Y7TVmc588j1_cBAJ4LlC2TTBU0peGv0xNOyjCeqNjZvxUjXkZHy1g0U-h93A8L4lN4oStYVN6dQfcFULLBEviSSJRX1A6Lcp1nX-2U0lqVc2TywI`


export const Border = {
    br_3xs: 10
}

export const Color = {
    error100: '#fcdcbf',
    white: "#fff",
    orange: "#fbba16",
    lightgreen: "#58c658",
    // lightgreen: "#1a4c1a",
    brown: '#f7a10d',
    gray_100: "#828282",
    red: "red",
    gray: "#221122",
    new_color: '#005072',
    gray_200: "#001b29",
    gray_300: "rgba(255, 255, 255, 0.01)",
    gray_400: "rgba(255, 255, 255, 0)",
    dimgray_100: "#707070",
    dimgray_200: "rgba(112, 112, 112, 0.9)",
    darkolivegreen_100: "#1a4c1a",
    gray6: "#f2f2f2",
    // limegreen: "#15a815",
    limegreen: "#1a4c1a",
    darkslategray_100: "#4b545a",
    black: "#3e4958",
    darkslategray_200: "rgba(62, 73, 88, 0.8)",
    darkslategray_300: "rgba(62, 73, 88, 0.6)",
    black: "#000",
    darkgray: "#97adb6",
    mintcream: "#f0faf0",
    blueviolet: "#7619e0",
    mediumpurple: "#c79bff",
    steelblue: "#0074ac",
    skyblue: "#9fe1ff",
    peru: "#d78f3a",
    sandybrown: "#fdbf73",
    lightcoral: "#fe8a97",
    darkmagenta: "#8b008b",
    tomato: "#ff5d2c",
    silver: "#bdbdbd",
    firebrick_100: "#bb2222",
    // grey: "#d5dde0",
    grey: '#828282',
    darkolivegreen_200: "#013220"
}