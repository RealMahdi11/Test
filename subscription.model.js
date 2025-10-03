import mongoose from "mongoose"

const subscriptionSchema = new mongoose.Schema({
    name: { type: String, required: true, min: 2, max: 100 },

    price: { type: Number, required: [true, "Subscription price is required"], min: [0, "Price must be greater than 0"] },

    currency: { type: String, enum: ["USD", "IRR"], default: "IRR" },

    frequency: { type: String, enum: ['Daily', "weekly", 'monthly', "yearly"] },

    category: { type: String, enum: ['sports', "news", 'technology'], required: true },

    paymentMethod: { type: String, required: true, trim: true },

    status: { type: String, enum: ["active", "cancelled", "expired"], default: "active" },

    startDate: {
        type: Date, required: true, validate: {
            validator: (value) =>
                value <= new Date(),
            message: "Start date must be in the past"

        }
    },
    renewalDate: {
        type: Date, validate: {
            validator: function (value) {
                return value > this.startDate()
            },
            message: "Renewal date must be after the start"

        }
    },
    user: { type: mongoose.Schema.types.ObjectId, ref: "User", required: true, index: true }


}, { timestamps: true })

// auto-calculate renewaldate if missing

subscription.pre("save", function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            monthly: 30,
            weekly: 7,
            yearly: 365,
        }
        this.renewalDate = new Date(this.startDate)
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency])
    }
    // auto-update the status if renwaldate has passed
    if (this.renewalDate < new Date()) {
        this.status = 'expired'
    }
    next()
})

const Subscription = mongoose.model("subscription", subscriptionSchema)
export default Subscription