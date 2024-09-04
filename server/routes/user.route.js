import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Router Test Done 🚀");
});

// router.post("/", (req, res) => {
//   res.send("Router Test Done 🚀");
// });

// router.put("/", (req, res) => {
//   res.send("Router Test Done 🚀");
// });

// router.delete("/", (req, res) => {
//   res.send("Router Test Done 🚀");
// });
export default router;
