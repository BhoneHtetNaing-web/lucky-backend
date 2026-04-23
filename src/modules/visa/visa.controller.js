const applyVisa = async (req, res) => {
    const { passport, country, name, dob } = req.body;

    if (!passport || !country || !name) {
        return res.status(400).json({ message: 
            "Missing fields"
        })
    }
    
    return res.json({
        message: "Visa application submitted",
        data: { passport, country, name, dob },
    });
};

module.exports = { applyVisa }