/* ════════════════════════════════════════════════════════════════
   STREET LEGAL — current drop catalog
   One source for the storefront ("/") and the drop page ("/drop").
   Add an item: drop its PNG in /public/products and add a line below.
   box = visible garment bounds inside the square PNG [x0, y0, x1, y1],
   used to scale each piece to fill its slot on the storefront.
   ════════════════════════════════════════════════════════════════ */
window.SL = {
  season: "NOV-DEC-JAN",

  contact: {
    phones: [],                       // e.g. ["+254 7XX XXX XXX"]
    email: "info@streetlegal.shop",
  },

  categories: [
    { key: "head",   apiCategory: "headwear", label: "Head gear", fill: [0.80, 0.80], items: [
      { id: "h1", code: "HG-01", name: "Noir Supply Beanie",  price: 200,  box: [0.176, 0.168, 0.824, 0.828] },
      { id: "h2", code: "HG-02", name: "Aura Streetwear Cap", price: 350,  box: [0.066, 0.219, 0.930, 0.770] },
      { id: "h3", code: "HG-03", name: "Aeon Studio Bucket",  price: 250,  box: [0.102, 0.207, 0.902, 0.793] },
    ]},
    { key: "top",    apiCategory: "top",      label: "Tops",      fill: [0.98, 0.90], items: [
      { id: "t1", code: "TP-01", name: "Void Heavy Hoodie",   price: 1500, box: [0.145, 0.047, 0.859, 0.934] },
      { id: "t2", code: "TP-02", name: "Axon-9 Tech Jacket",  price: 500,  box: [0.145, 0.035, 0.852, 1.000] },
      { id: "t3", code: "TP-03", name: "Aether Graphic Tee",  price: 500,  box: [0.129, 0.000, 0.883, 0.930] },
    ]},
    { key: "bottom", apiCategory: "bottom",   label: "Bottoms",   fill: [0.96, 0.97], items: [
      { id: "b1", code: "BT-01", name: "Aether Cargo Jogger", price: 1200, box: [0.301, 0.055, 0.699, 0.945] },
      { id: "b2", code: "BT-02", name: "Archive Baggy Denim", price: 1500, box: [0.234, 0.043, 0.766, 0.957] },
      { id: "b3", code: "BT-03", name: "Street Nylon Shorts", price: 700,  box: [0.066, 0.133, 0.934, 0.828] },
    ]},
    { key: "feet",   apiCategory: "footwear", label: "Foot gear", fill: [0.92, 0.84], items: [
      { id: "f1", code: "FG-01", name: "Apex Neo Runners",    price: 2500, box: [0.051, 0.121, 0.949, 0.848] },
      { id: "f2", code: "FG-02", name: "Urban Tactical Boot", price: 2500, box: [0.082, 0.145, 0.918, 0.867] },
      { id: "f3", code: "FG-03", name: "Canvas High-Tops",    price: 1200, box: [0.047, 0.227, 0.953, 0.859] },
    ]},
  ],
};
