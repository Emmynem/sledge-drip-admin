import axios from 'axios';
import { config } from '../config';

const getAllAppDefault = async function (key, page, size) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/app/defaults?page=${page}&size=${size}`,
			{
				headers: {
					'sledgedrip-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const getAppDefault = async function (key, payload) {
	try {
		const response = await axios.get(
			`${config.baseAPIurl}/root/app/default?unique_id=${payload.unique_id}`,
			{
				headers: {
					'sledgedrip-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const addAppDefault = async function (key, payload) {
	try {
		const response = await axios.post(
			`${config.baseAPIurl}/root/app/default/add`,
			{
				...payload
			},
			{
				headers: {
					'sledgedrip-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const editAppDefault = async function (key, payload) {
	try {
		const response = await axios.put(
			`${config.baseAPIurl}/root/app/default/edit`,
			{
				...payload
			},
			{
				headers: {
					'sledgedrip-access-key': key
				}
			}
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

const deleteAppDefault = async function (key, payload) {
	try {
		const response = await axios.delete(
			`${config.baseAPIurl}/root/app/default`,
			{
				data: {
					key,
					...payload
				}
			},
		);
		return { err: false, data: response.data };
	} catch (error) {
		return { err: true, error, response_code: error.response.status };
	}
};

export { getAllAppDefault, getAppDefault, addAppDefault, editAppDefault, deleteAppDefault };