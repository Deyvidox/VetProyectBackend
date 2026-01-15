import bcrypt from "bcrypt"
import { ClientRegisterValidated } from "../validates/client.validation.js"
import { ClientRegister, RegisterUnique } from "../modules/client.modules.js"

export const ClientRegisterControl = async (req, res, next) => {
    try {
        const { error, value } = ClientRegisterValidated.validate(req.body)

        if (error) {
            req.message = { "type": "Validation", "message": error.details, "status": 400 }
            return next()
        }

        const unique = await RegisterUnique(value.identification_number, value.phone, value.username, value.email)

        if (unique.results > 0) {
            req.message = {
                "type": "Validation", "message": "A user with this data already exists.",
                "status": 400
            }
            return next()
        }

        const hash = await bcrypt.hash(value.password, 10)

        const { results, data } = await ClientRegister(
            hash, value.address, value.date_of_birth,
            value.email, value.first_name, value.identification_number, value.last_name,
            value.phone, value.profile_photo, value.role_id, value.username
        )

        req.message = {
            type: "Successfully", message: {
                context: "Registration completed successfully",
                count: results, user: data
            },
            status: 201
        }
        return next()

    } catch (err) {
        req.message = { type: "Error", message: err.message, status: 400 }
        return next()
    }
}
