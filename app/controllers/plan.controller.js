const Plan = require("../models/plan.model"); // Adjust the path to the Plan model

exports.createPlan = async (req, res) => {
  const { description, hardness, period, list_exercise_per_day } = req.body;

  try {
    const newPlan = await Plan.create({
      description,
      hardness,
      period,
      list_exercise_per_day,
    });
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(400).json(error);
  }
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find();
    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

exports.getPlanById = async (req, res) => {
  const planId = req.params.id;

  try {
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(plan);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plan" });
  }
};

exports.updatePlanById = async (req, res) => {
  const planId = req.params.id;
  const { description, hardness, period, detail_plan_id } = req.body;

  try {
    const updatedPlan = await Plan.findByIdAndUpdate(
      planId,
      {
        description,
        hardness,
        period,
        detail_plan_id,
      },
      { new: true }
    );
    if (!updatedPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(200).json(updatedPlan);
  } catch (error) {
    res.status(500).json({ error: "Failed to update plan" });
  }
};

exports.deletePlanById = async (req, res) => {
  const planId = req.params.id;

  try {
    const deletedPlan = await Plan.findByIdAndDelete(planId);
    if (!deletedPlan) {
      return res.status(404).json({ error: "Plan not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete plan" });
  }
};
