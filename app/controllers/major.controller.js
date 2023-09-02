const Major = require('../models/major.model');

exports.createMajor = async (req, res) => {
    try {
        const { name } = req.body;
        const major = new Major({
            name,
        });

        await major.save();

        res.status(201).send({ message: 'Major created successfully.', major });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
};

exports.updateMajor = async (req, res) => {
    try {
        const { id } = req.params;

        const major = await Major.findById(id);

        if (!major) {
            return res.status(404).send({ message: 'Major not found.' });
        }

        const { name } = req.body;

        major.name = name || major.name;

        await major.save();

        res.status(200).send({ message: 'Major updated successfully.', major });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
};

exports.deleteMajor = async (req, res) => {
    try {
        const { id } = req.params;

        const major = await Major.findByIdAndDelete(id);

        if (!major) {
            return res.status(404).send({ message: 'Major not found.' });
        }

        res.status(200).send({ message: 'Major deleted successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error occurred.' });
    }
};
