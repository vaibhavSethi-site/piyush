// CardComponent.js
import React, { useState, useEffect } from "react";

const CardComponent = ({ onAddToCart }) => {
  const imageUrl =
    "http://www.rollerwall.com/cdn/shop/files/pattern-roller-and-applicator_600x600.jpg?v=1613507302";
  const [quantity, setQuantity] = useState(1);

  const data = [
    {
      rollerSize: "2 inches",
      pipeSizes: [
        {
          size: "12 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "APOXY",
              rollers: [
                {
                  name: "APOXY (INDIAN)                  ",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "APOXY (IMPORTED)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            // Add more categories as needed
          ],
        },
        {
          size: "20 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: [{
                    capName: "Nut Handle Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  },
                  {
                    capName: "Push Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  }
                  ]
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "APOXY",
              rollers: [
                {
                  name: "APOXY (INDIAN)                  ",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "APOXY (IMPORTED)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            // Add more categories as needed
          ],
        },
        {
          size: "25 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: [{
                    capName: "Nut Handle Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  },
                  {
                    capName: "Push Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  }
                  ]
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "APOXY",
              rollers: [
                {
                  name: "APOXY (INDIAN)                  ",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "APOXY (IMPORTED)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            // Add more categories as needed
          ],
        },
        {
          size: "30 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: [{
                    capName: "Nut Handle Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  },
                  {
                    capName: "Push Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  }
                  ]
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "APOXY",
              rollers: [
                {
                  name: "APOXY (INDIAN)                  ",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "APOXY (IMPORTED)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            // Add more categories as needed
          ],
        },
        // Add more pipe sizes as needed
      ],
    },
    {
      rollerSize: "2 inches",
      pipeSizes: [
        {
          size: "12 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            
            // Add more categories as needed
          ],
        },
        {
          size: "20 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: [{
                    capName: "Nut Handle Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  },
                  {
                    capName: "Push Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  }
                  ]
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "APOXY",
              rollers: [
                {
                  name: "APOXY (INDIAN)                  ",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: [" 4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "APOXY (IMPORTED)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            // Add more categories as needed
          ],
        },
        {
          size: "25 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: [{
                    capName: "Nut Handle Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  },
                  {
                    capName: "Push Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  }
                  ]
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "APOXY",
              rollers: [
                {
                  name: "APOXY (INDIAN)                  ",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "APOXY (IMPORTED)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            // Add more categories as needed
          ],
        },
        {
          size: "30 mm",
          categories: [
            {
              category: "Unifiber",
              rollers: [
                {
                  name: "WHITE/YELLOW LINE (LOCAL)",
                  cap: [{
                    capName: "Nut Handle Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  },
                  {
                    capName: "Push Cap",
                    polys:  [
                      {
                        poly: "ROLTEX POLY",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                      {
                        poly: "Plain Poly",
                        nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                      },
                    ],
                  }
                  ]
                },
                {
                  name: "WHITE/YELOW LINE (650 GSM)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "Microfiber",
              rollers: [
                {
                  name: "PURE WHITE M/F (6MM)",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "RED DOT M/F (6MM)                  ",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            {
              category: "APOXY",
              rollers: [
                {
                  name: "APOXY (INDIAN)                  ",
                  cap: "NUT HANDLE Cap",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                {
                  name: "APOXY (IMPORTED)",
                  cap: "NUT HANDLE CAP",
                  polys: [
                    {
                      poly: "ROLTEX POLY",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                    {
                      poly: "Plain Poly",
                      nutHandle: ["4.5mm nut handle ( semi grip)", "4.5mm nut handle ( first grip)", "[1/2 ] 2`` semi handle", "[1/2 ] 2`` first handle"  ],
                    },
                  ],
                },
                // Add more rollers as needed
              ],
            },
            // Add more categories as needed
          ],
        },
        // Add more pipe sizes as needed
      ],
    },
    // Add more roller sizes as needed
  ];

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value, 10)) || 1);
  };

  const handleAddToCartClick = () => {
    onAddToCart("Premium Paint Roller", quantity);
  };

  return (
    <div className="card card-body">
      <img src={imageUrl} alt="Roller Image" className="card-img-top" />
      <hr />
      <div className="d-flex mb-4 align-items-center">
        <div className="flex-shrink-0">
          <img
            src="assets/images/users/avatar-1.jpg"
            alt=""
            className="avatar-sm rounded-circle"
          />
        </div>
        <div className="flex-grow-1 ms-2">
          <h5 className="card-title mb-1">Testing</h5>
          <p className="text-muted mb-0">Digital Marketing</p>
        </div>
      </div>
      <h6 className="mb-1">$15,548</h6>
      <p className="card-text text-muted">Expense Account</p>
      <div className="quantity">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
        />
      </div>
      <button
        className="btn btn-sm"
        style={{ backgroundColor: "navy", color: "white" }}
        onClick={handleAddToCartClick}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default CardComponent;
