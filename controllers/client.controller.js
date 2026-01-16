import bcrypt from "bcrypt"
import { ClientRegisterValidated, SearchUsersValidated, UpdateUserValidated, UserIdValidated } from "../validates/client.validation.js"
import { ClientRegister, DeactivateUser, GetAllUsers, GetUserById, RegisterUnique, SearchUsers, UpdateUser } from "../modules/client.modules.js"

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
export const UpdateUserControl = async (req, res, next) => {
    try {
        const { error } = UpdateUserValidated.validate({
            'first_name': req.body.first_name,
            'last_name': req.body.last_name,
            'username': req.body.username,
            'phone': req.body.phone,
            'address': req.body.address,
            'date_of_birth': req.body.date_of_birth,
            'id': req.params.id
        })

        if (error) {
            req.message = { "type": "Validation", "message": error.details, "status": 400 }
            return next()
        }

        const user = await GetUserById(req.params.id);

        if (!user) {
            req.message = {
                "type": "Error",
                "message": "User not found",
                "status": 404
            }
            return next()
        }

        const { results, data } = await UpdateUser(req.params.id, req.body)

        if (results == 0) {
            req.message = {
                "type": "Error",
                "message": "User not found or could not be updated",
                "status": 404
            }
            return next()
        }

        req.message = {
            type: "Successfully",
            message: {
                context: "User updated successfully",
                user: data
            },
            status: 200
        }
        return next()

    } catch (err) {
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}
export const DeactivateUserControl = async (req, res, next) => {
    try {
        const userId = req.params.id || req.body.id;

        if (!userId) {
            req.message = {
                "type": "Validation",
                "message": "User ID is required",
                "status": 400
            }
            return next()
        }

        const result = await DeactivateUser(userId);

        if (result.results === 0) {
            req.message = {
                "type": "Error",
                "message": "User not found",
                "status": 404
            }
            return next()
        }

        req.message = {
            type: "Successfully",
            message: {
                context: "User deactivated successfully",
                user: result.data
            },
            status: 200
        }
        return next()

    } catch (err) {
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}
export const SearchUsersControl = async (req, res, next) => {
    try {
        const { error, value } = SearchUsersValidated.validate(req.body)

        if (error) {
            req.message = {
                "type": "Validation",
                "message": error.details,
                "status": 400
            }
            return next()
        }

        const { results, data } = await SearchUsers(value.search, value.limit);

        if (results == 0) {
            req.message = {
                "type": "Successfully",
                "message": "No Clients",
                "status": 200
            }
            return next()
        }

        req.message = {
            type: "Successfully",
            message: {
                context: "Search completed successfully",
                count: results,
                users: data
            },
            status: 200
        }
        return next()

    } catch (err) {
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}

export const GetAllUsersControl = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;

        const pageNum = page ? parseInt(page) : 1;
        const limitNum = limit ? parseInt(limit) : 10;
        const statusFilter = status || null;

        if (pageNum < 1) {
            req.message = {
                "type": "Validation",
                "message": "Page number must be greater than 0",
                "status": 400
            }
            return next()
        }

        if (limitNum < 1 || limitNum > 100) {
            req.message = {
                "type": "Validation",
                "message": "Limit must be between 1 and 100",
                "status": 400
            }
            return next()
        }

        if (statusFilter && !['Active', 'Inactive', 'Pending'].includes(statusFilter)) {
            req.message = {
                "type": "Validation",
                "message": "Invalid status filter",
                "status": 400
            }
            return next()
        }

        const result = await GetAllUsers(pageNum, limitNum, statusFilter);

        req.message = {
            type: "Successfully",
            message: {
                context: "Users retrieved successfully",
                count: result.data.length,
                pagination: result.pagination,
                users: result.data
            },
            status: 200
        }
        return next()

    } catch (err) {
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}
export const GetUserByIdControl = async (req, res, next) => {
    try {
        const { error, value } = UserIdValidated.validate({ "id": req.params.id })

        if (error) {
            req.message = {
                "type": "Validation",
                "message": "User ID is required",
                "status": 400
            }
            return next()
        }

        const user = await GetUserById(value.id);

        if (!user) {
            req.message = {
                "type": "Error",
                "message": "User not found",
                "status": 404
            }
            return next()
        }

        req.message = {
            type: "Successfully",
            message: {
                context: "User retrieved successfully",
                user: user
            },
            status: 200
        }
        return next()

    } catch (err) {
        req.message = {
            type: "Error",
            message: err.message,
            status: 400
        }
        return next()
    }
}
