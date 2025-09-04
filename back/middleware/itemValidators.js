module.exports = {
    validateCreateItem: (req, res, next) => {
        const {title, price, image} = req.body;

        if(!title || !price || !image){
            return res.send({ success: false, message: "Title, price and image are required" });
        }
        next();
    },

    validateUpdateItem: (req, res, next) => {
        const { title, description, image } = req.body;

        if (!title && !description && !image) {
            return res.send({ success: false, message: "Nothing to update" });
        }
        next();
    }
}