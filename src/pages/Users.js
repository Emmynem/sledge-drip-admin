import { useEffect, useState } from "react";
import Navbar from '../components/Navbar';
import Screen from '../components/Screen';
import Content from '../components/Content';
import Arrowright from '../icons/Arrowright';
import Arrowleft from '../icons/Arrowleft';
import { getUsers, getUserViaEmail, getUser } from "../api/users";
import useCookie from "../hooks/useCookie";
import { config } from "../config";
import { 
	useGrantUserAccess, useRevokeUserAccess, useSuspendUserAccess
} from "../hooks/useUsers";
import Loading from "../icons/Loading";
import Close from "../icons/Close";
import Star from "../icons/Star";
import Wallet from "../icons/Wallet";
import Edit from "../icons/Edit";
import KeyAlt from "../icons/KeyAlt";
import Delete from "../icons/Delete";
import Reset from "../icons/Reset";
import Check from "../icons/Check";
import EyeOpenAlt from "../icons/EyeOpenAlt";
import CheckCircle from "../icons/CheckCircle";
import Search from "../icons/Search";
import Copy from "../icons/Copy";

export default function Users() {
	const { cookie, forceLogout } = useCookie(config.key, "");
	const [copiedText, setCopiedText] = useState(false);
	const [textCopied, setTextCopied] = useState(null);
	
	const {
		errorGrantUserAccess, handleGrantUserAccess, loadingGrantUserAccess, removeGrantUserAccessModal, setRemoveGrantUserAccessModal, 
		setUserUniqueId: GrantAccessUserUserUniqueId, successGrantUserAccess
	} = useGrantUserAccess();

	const {
		errorSuspendUserAccess, handleSuspendUserAccess, loadingSuspendUserAccess, removeSuspendUserAccessModal, setRemoveSuspendUserAccessModal,
		setUserUniqueId: SuspendAccessUserUserUniqueId, successSuspendUserAccess
	} = useSuspendUserAccess();

	const {
		errorRevokeUserAccess, handleRevokeUserAccess, loadingRevokeUserAccess, removeRevokeUserAccessModal, setRemoveRevokeUserAccessModal,
		setUserUniqueId: RevokeAccessUserUserUniqueId, successRevokeUserAccess
	} = useRevokeUserAccess();

	const [allUsers, setAllUsers] = useState(null);
	const [errorAllUsers, setErrorAllUsers] = useState(null);
	const [loadingAllUsers, setLoadingAllUsers] = useState(false);

	const [size, setSize] = useState(50);
	const [page, setPage] = useState(1);

	const handleSize = (e) => { e.preventDefault(); setSize(e.target.value); setPage(1); getAllUsers(page, e.target.value); };
	const handlePage = (e) => { e.preventDefault(); setPage(parseInt(e.target.value)); getAllUsers(parseInt(e.target.value), size); };

	async function previousUsers() {
		if (page !== 1) setPage(page - 1);
		if (page !== 1) getAllUsers(page - 1, size);
	};

	async function nextUsers() {
		if (page < allUsers.data.pages) setPage(page + 1);
		if (page < allUsers.data.pages) getAllUsers(page + 1, size);
	};

	async function getAllUsers(_page, _size) {
		setLoadingAllUsers(true);
		const response = await getUsers(cookie, (_page || page), (_size || size));
		setAllUsers(response.data);
		if (response.error) setErrorAllUsers(response.error.response.status === 422 ? response.error.response.data.data[0].msg : response.error.response.data.message);
		setLoadingAllUsers(false);
	};

	useEffect(() => {
		if (allUsers === null) {
			getAllUsers();
		}
	}, [allUsers]);

	const [loadingViewUser, setLoadingViewUser] = useState(false);
	const [errorViewUser, setErrorViewUser] = useState(null);
	const [viewUserDetails, setViewUserDetails] = useState(null);

	async function getUserDetails(user_unique_id) {
		setLoadingViewUser(true);
		const response = await getUser(cookie, {user_unique_id});
		if (!response.err) { setViewUserDetails(response.data); }
		else { setErrorViewUser(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg) };
		setLoadingViewUser(false);
	};

	async function getUserDetailsViaEmail(email) {
		const modalResponse = document.querySelector("#userSearchModal");
		modalResponse.setAttribute("display", false);
		setLoadingViewUser(true);
		const response = await getUserViaEmail(cookie, { email });
		if (!response.err) { setViewUserDetails(response.data); }
		else { setViewUserDetails(null); setErrorViewUser(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg) };
		setLoadingViewUser(false);
		setUserEmailSearch("");
	};

	async function getUserDetailsViaUserUniqueId(user_unique_id) {
		const modalResponse = document.querySelector("#userSearchModal");
		modalResponse.setAttribute("display", false);
		setLoadingViewUser(true);
		const response = await getUser(cookie, { user_unique_id });
		if (!response.err) { setViewUserDetails(response.data); }
		else { setViewUserDetails(null); setErrorViewUser(response.response_code !== 422 ? response.error.response.data.message : response.error.response.data.data[0].msg) };
		setLoadingViewUser(false);
		setUserUniqueIdSearch("");
	};

	const [userEmailSearch, setUserEmailSearch] = useState("");
	const handleUserEmailSearch = (e) => { e.preventDefault(); setUserEmailSearch(e.target.value); };

	const [userUserUniqueIdSearch, setUserUniqueIdSearch] = useState("");
	const handleUserUserUniqueIdSearch = (e) => { e.preventDefault(); setUserUniqueIdSearch(e.target.value); };

	if (removeGrantUserAccessModal) {
		const modalResponse = document.querySelector("#grantUserAccessModal");
		modalResponse.setAttribute("display", false);
		getUserDetails(viewUserDetails.data.user_unique_id);
		setRemoveGrantUserAccessModal(null);
	}
	if (removeSuspendUserAccessModal) {
		const modalResponse = document.querySelector("#suspendUserAccessModal");
		modalResponse.setAttribute("display", false);
		getUserDetails(viewUserDetails.data.user_unique_id);
		setRemoveSuspendUserAccessModal(null);
	}
	if (removeRevokeUserAccessModal) {
		const modalResponse = document.querySelector("#revokeUserAccessModal");
		modalResponse.setAttribute("display", false);
		getUserDetails(viewUserDetails.data.user_unique_id);
		setRemoveRevokeUserAccessModal(null);
	}

	const copySomeText = (text) => {
		navigator.clipboard.writeText(text);
	};

	const copyText = (text) => {
		copySomeText(text);
		setCopiedText(true);
		setTimeout(function () {
			setCopiedText(false);
		}, 2000)
	};

	const pageSelectArray = new Array(allUsers ? allUsers.data.pages : 0).fill(0);

	return (
		<>
			<Screen aside="false" navbar="false">
				<Content>
					<Navbar placeholder="Search something..." makeHidden={true} />
					<section className=''>
						<div className='xui-d-flex xui-flex-ai-center xui-flex-jc-space-between xui-py-1 psc-section-header'>
							<div className="xui-mb-1">
								<h1 className='xui-font-sz-110 xui-font-w-normal'>All Users</h1>
								<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">View and edit all users details</p>
							</div>
							<div className="xui-mb-1">
								<div className='xui-d-inline-flex'>
									<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-blue xui-bdr-rad-half xui-font-sz-80" xui-modal-open="userSearchModal">
										<span className="xui-mr-half">Search</span>
										<Search width="15" height="15" />
									</button>
								</div>
							</div>
						</div>
						{
							loadingAllUsers ?
								<center className='xui-font-sz-110 xui-py-3'><Loading width="12" height="12" /></center> :
								(
									allUsers && allUsers.success ?
										<div className='xui-table-responsive'>
											<table className='xui-table xui-font-sz-90'>
												<thead>
													<tr className='xui-text-left xui-opacity-6'>
														<th className='xui-w-30'>S/N</th>
														<th className='xui-min-w-100'>User Unique Id</th>
														<th className='xui-min-w-100'>Method</th>
														<th className='xui-min-w-400'>Name</th>
														<th className='xui-min-w-300'>Email</th>	
														<th className='xui-min-w-100'>Referrals</th>
														<th className='xui-min-w-150'>Access</th>
														<th className='xui-min-w-100'>Status</th>
														<th className='xui-min-w-300'>Created At</th>
														<th className='xui-min-w-300'>Updated At</th>
														<th className='xui-min-w-50'>Actions</th>
													</tr>
												</thead>
												<tbody>
													{allUsers.data.rows.map((data, i) => (
														<tr className='' key={i}>
															<td className='xui-opacity-5'>
																<span>{i + 1}</span>
															</td>
															<td className='xui-opacity-5 xui-font-w-bold'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>#{data.user_unique_id}</span>
																	<span title="Copy User Unique Id" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.user_unique_id); setTextCopied(data.user_unique_id); }}>
																		{copiedText && textCopied === data.user_unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.method}</span>
															</td>
															<td className='xui-opacity-5'>
																<div className='xui-d-inline-flex xui-flex-ai-center'>
																	<span>{data.fullname}</span>
																	<span title="Copy Full Name" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.fullname); setTextCopied(data.fullname); }}>
																		{copiedText && textCopied === data.fullname ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																	</span>
																</div>
															</td>
															<td className='xui-opacity-5 xui-font-w-bold'>
																<span>
																	{
																		data.email_verified ?
																			<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>
																				<div className='xui-d-inline-flex xui-flex-ai-center'>
																					<span>{data.email}</span>
																					<span title="Copy Email" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(data.email); setTextCopied(data.email); }}>
																						{copiedText && textCopied === data.email ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																					</span>
																				</div>
																			</span> :
																			<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{data.email}</span>
																	}
																</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.referral_count === 0 ? "None" : data.referral_count.toLocaleString()}</span>
															</td>
															<td className='xui-opacity-5'>
																{
																	data.access === 1 ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Granted</span> : (
																			data.access === 2 ? 
																				<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>Suspended</span> : (
																					data.access === 3 ? 
																						<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Revoked</span> : 
																						<span className='xui-badge xui-badge-blue xui-font-sz-80 xui-bdr-rad-half'>No Idea</span>
																				)
																		)
																}
															</td>
															<td className='xui-opacity-5'>
																{
																	data.status === 1 ?
																		<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Active</span> :
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Inactive</span>
																}
															</td>
															<td className='xui-opacity-5'>
																<span>{data.createdAt.date} at {data.createdAt.time}</span>
															</td>
															<td className='xui-opacity-5'>
																<span>{data.updatedAt.date} at {data.updatedAt.time}</span>
															</td>
															<td className=''>
																<div className="xui-d-flex xui-grid-gap-1">
																	<button title="View User Details" onClick={() => { getUserDetails(data.user_unique_id) }} className="xui-d-inline-flex xui-flex-ai-center xui-btn xui-btn-blue xui-bdr-rad-half xui-font-sz-50" xui-modal-open="viewUserDetailsModal">
																		<EyeOpenAlt width="16" height="16" />
																	</button>
																</div>
															</td>
														</tr>
													))}
												</tbody>
											</table>
										</div> :
										<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
											<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
												<center className="xui-text-red">
													<Close width="100" height="100" />
													<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorAllUsers}</h3>
												</center>
											</div>
										</div>
								)
						}
						{
							loadingAllUsers ?
								<Loading width="12" height="12" /> :
								(
									allUsers && allUsers.success ?
										<div className='xui-d-flex xui-flex-jc-flex-end xui-py-1 xui-font-sz-85 xui-opacity-5 xui-mt-1'>
											<div className='xui-d-inline-flex xui-flex-ai-center'>
												<span>Rows per page:</span>
												<select value={size} onChange={handleSize} className='psc-select-rows-per-page xui-ml-half'>
													<option value={20}>20</option>
													<option value={50}>50</option>
													<option value={100}>100</option>
													<option value={500}>500</option>
													<option value={1000}>1000</option>
												</select>
											</div>
											<div className='xui-mx-1 xui-lg-mx-2'>
												<span><span className='xui-font-w-bold'><select value={page} onChange={handlePage} className='psc-select-rows-per-page xui-ml-half'>
													{
														pageSelectArray.map((value, index) => {
															return (
																<option key={index + 1} value={index + 1}>{index + 1}</option>
															)
														})
													}
												</select></span> of {allUsers ? allUsers.data.pages : "..."}</span>
											</div>
											<div className='xui-d-inline-flex xui-flex-ai-center xui-mx-1'>
												<div className='xui-mr-half xui-cursor-pointer' title="Previous" onClick={previousUsers}>
													<Arrowleft width="18" height="18" />
												</div>
												<div className='xui-ml-half xui-cursor-pointer' title="Next" onClick={nextUsers}>
													<Arrowright width="18" height="18" />
												</div>
											</div>
										</div> :
										""
								)
						}
					</section>
				</Content>
			</Screen>
			<section className='xui-modal' xui-modal="viewUserDetailsModal" id="viewUserDetailsModal">
				<div className='xui-modal-content xui-max-h-700 xui-max-w-1000 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="viewUserDetailsModal">
						<Close width="24" height="24" />
					</div>
					{
						loadingViewUser ?
							<center>
								<Loading width="12" height="12" />
							</center> : (
								viewUserDetails && viewUserDetails.success ?
									<>
										<h1>{viewUserDetails.data.firstname + (viewUserDetails.data.middlename ? " " + viewUserDetails.data.middlename + " " : " ") + viewUserDetails.data.lastname}</h1>
										<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Details of this user below</p>
										<div className="xui-d-grid xui-grid-col-1 xui-lg-grid-col-2 xui-md-grid-col-2 xui-grid-gap-1">
											<div className="xui-w-200 xui-h-200 xui-m-1-half xui-mb-6">
												<img className="xui-img-200 xui-max-h-200 xui-bdr-rad-circle" src={viewUserDetails.data.photo} alt={viewUserDetails.data.firstname + (viewUserDetails.data.middlename ? " " + viewUserDetails.data.middlename + " " : " ") + viewUserDetails.data.lastname + " Selfie Image"} />
												<center className="xui-mt-1">
													<b className="xui-opacity-4 xui-font-sz-100 xui-m-half">User Unique Id - 
														<span className='xui-badge xui-badge-info xui-font-sz-80 xui-bdr-rad-half'>
															<div className='xui-d-inline-flex xui-flex-ai-center'>
																<span>{viewUserDetails.data.user_unique_id}</span>
																<span title="Copy User Unique Id" className="xui-cursor-pointer xui-ml-1" onClick={() => { copyText(viewUserDetails.data.user_unique_id); setTextCopied(viewUserDetails.data.user_unique_id); }}>
																	{copiedText && textCopied === viewUserDetails.data.user_unique_id ? <Check width="16" height="16" /> : <Copy width="16" height="16" />}
																</span>
															</div>
														</span>
													</b>
													<p className="xui-opacity-4 xui-font-sz-100 xui-m-half">Referrals: <b>{viewUserDetails.data.referral_count.toLocaleString()}</b></p>
												</center>
											</div>
											<div className="xui-m-1-half xui-lg-ml--10 xui-md-ml--7">
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Method -</span> {viewUserDetails.data.method}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">First Name -</span> {viewUserDetails.data.firstname}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Middle Name -</span> {viewUserDetails.data.middlename ? viewUserDetails.data.middlename : "No middle name"}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Last Name -</span> {viewUserDetails.data.lastname}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Email -</span> {
													viewUserDetails.data.email_verified ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{viewUserDetails.data.email}</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{viewUserDetails.data.email}</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Phone Number -</span> {
													viewUserDetails.data.phone_number_verified ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>{viewUserDetails.data.phone_number}</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>{viewUserDetails.data.phone_number}</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Gender -</span> {viewUserDetails.data.gender} | <span className="xui-font-w-bold">Date of Birth -</span> {new Date(viewUserDetails.data.dob).toDateString()} / {viewUserDetails.data.dob}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Referral ID -</span> {viewUserDetails.data.ref_id}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Balance -</span> NGN {viewUserDetails.data.balance.toLocaleString()}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Payment Balance -</span> NGN {viewUserDetails.data.payment_balance.toLocaleString()}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Account Name -</span> {viewUserDetails.data.account_name ? viewUserDetails.data.account_name : "None"}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Account Number -</span> {viewUserDetails.data.account_number ? viewUserDetails.data.account_number : "None"}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Bank -</span> {viewUserDetails.data.bank ? viewUserDetails.data.bank : "None"}</p>
												<hr></hr>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">2FA -</span> {
													viewUserDetails.data.two_factor_authentication ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Enabled</span> :
														<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Disabled</span>
												}</p>
												<p className="xui-opacity-4 xui-font-sz-100 xui-m-half"><span className="xui-font-w-bold">Access -</span> {
													viewUserDetails.data.access === 1 ?
														<span className='xui-badge xui-badge-success xui-font-sz-80 xui-bdr-rad-half'>Granted</span> : (
															viewUserDetails.data.access === 2 ?
																<span className='xui-badge xui-badge-warning xui-font-sz-80 xui-bdr-rad-half'>Suspended</span> : (
																	viewUserDetails.data.access === 3 ?
																		<span className='xui-badge xui-badge-danger xui-font-sz-80 xui-bdr-rad-half'>Revoked</span> :
																		<span className='xui-badge xui-badge-blue xui-font-sz-80 xui-bdr-rad-half'>No Idea</span>
																)
														)
												}</p>
											</div>
										</div>
										<center>
											<p className="xui-opacity-4 xui-font-sz-90 xui-m-half">Created - {viewUserDetails.data.createdAt.fulldate} | Last Updated - {viewUserDetails.data.updatedAt.fulldate}</p>
											<div className="xui-m-2">
												<button title="Grant User Access" onClick={() => { GrantAccessUserUserUniqueId(viewUserDetails.data.user_unique_id); }} className="xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-50" xui-modal-open="grantUserAccessModal">
													<Check width="16" height="16" />
												</button>
												<button title="Suspend User Access" onClick={() => { SuspendAccessUserUserUniqueId(viewUserDetails.data.user_unique_id); }} className="xui-ml-3 xui-mr-3 xui-btn xui-bg-warning xui-text-white xui-bdr-rad-half xui-font-sz-50" xui-modal-open="suspendUserAccessModal">
													<KeyAlt width="16" height="16" />
												</button>
												<button title="Revoke User Access" onClick={() => { RevokeAccessUserUserUniqueId(viewUserDetails.data.user_unique_id); }} className="xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-50" xui-modal-open="revokeUserAccessModal">
													<Close width="16" height="16" />
												</button>
											</div>
										</center>
									</> : 
									<div className="xui-d-grid xui-lg-grid-col-1 xui-grid-gap-2 xui-mt-2">
										<div className="xui-bdr-w-1 xui-bdr-s-solid xui-bdr-fade xui-py-2 xui-px-1">
											<center className="xui-text-red">
												<Close width="100" height="100" />
												<h3 className="xui-font-sz-120 xui-font-w-normal xui-mt-half">{errorViewUser}</h3>
											</center>
										</div>
									</div>
							)
					}
				</div>
			</section>
			<section className='xui-modal' xui-modal="grantUserAccessModal" id="grantUserAccessModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Grant User Access</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorGrantUserAccess}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successGrantUserAccess}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleGrantUserAccess} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingGrantUserAccess ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingGrantUserAccess ? "" : "grantUserAccessModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="suspendUserAccessModal" id="suspendUserAccessModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Suspend User Access</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorSuspendUserAccess}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successSuspendUserAccess}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleSuspendUserAccess} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingSuspendUserAccess ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingSuspendUserAccess ? "" : "suspendUserAccessModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="revokeUserAccessModal" id="revokeUserAccessModal">
				<div className='xui-modal-content xui-max-h-500 xui-overflow-auto xui-pos-relative'>
					<center>
						<h1>Revoke User Access</h1>
						<p className="xui-opacity-5 xui-font-sz-90 xui-mt-half">Are you sure you want to continue with this action?</p>
					</center>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-red"><span className="xui-font-w-bold psc-text-red">{errorRevokeUserAccess}</span></p>
					<p className="xui-font-sz-100 xui-my-1 xui-mt-1 xui-text-center xui-text-green"><span className="xui-font-w-bold psc-text-red">{successRevokeUserAccess}</span></p>
					<div className="xui-d-flex xui-flex-ai-center xui-flex-jc-space-evenly xui-mt-2">
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button onClick={handleRevokeUserAccess} className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-green xui-bdr-rad-half xui-font-sz-85">
								<span className="xui-mr-half">Yes</span>
								{
									loadingRevokeUserAccess ?
										<Loading width="12" height="12" />
										: <Check width="20" height="20" />
								}
							</button>
						</div>
						<div className="xui-d-inline-flex xui-flex-ai-center">
							<button className="xui-d-inline-flex xui-flex-ai-center xui-btn psc-btn-red xui-bdr-rad-half xui-font-sz-85" xui-modal-close={loadingRevokeUserAccess ? "" : "revokeUserAccessModal"}>
								<span className="xui-mr-half">No</span>
								<Close width="20" height="20" />
							</button>
						</div>
					</div>
				</div>
			</section>
			<section className='xui-modal' xui-modal="userSearchModal" id="userSearchModal">
				<div className='xui-modal-content xui-max-h-700 xui-overflow-auto xui-pos-relative'>
					<div className="xui-w-40 xui-h-40 xui-bdr-rad-circle xui-d-flex xui-flex-ai-center xui-flex-jc-center psc-bg xui-text-white psc-modal-close" xui-modal-close="userSearchModal">
						<Close width="24" height="24" />
					</div>
					<h1>Search for User</h1>
					<form className="xui-form xui-mt-2" onSubmit={(e) => { 
						e.preventDefault(); 
						if (userEmailSearch.length > 0) { 
							getUserDetailsViaEmail(userEmailSearch); 
						} else if (userUserUniqueIdSearch.length > 0) { 
							getUserDetailsViaUserUniqueId(userUserUniqueIdSearch); 
						} else {

						}
					}}>
						<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
							<label>Email</label>
							<div className="xui-d-flex xui-flex-ai-center">
								<input style={{ width: "calc(100% - 50px)" }} type={"email"} placeholder={"Enter email address"} value={userEmailSearch} onChange={handleUserEmailSearch} />
								<button className="xui-bdr-light-blue xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-light-blue xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text" xui-modal-open={`${userEmailSearch ? "viewUserDetailsModal" : ""}`}>
									<Search width="16" height="16" />
								</button>
							</div>
						</div>
						<div className="psc-broken-line-text xui-opacity-4 xui-mt-2 xui-mb-2">
							<span className="xui-font-sz-80 xui-font-w-700">Or</span>
						</div>
						<div className="xui-w-fluid-100 xui-lg-w-fluid-100">
							<label>User Unique Id</label>
							<div className="xui-d-flex xui-flex-ai-center">
								<input style={{ width: "calc(100% - 50px)" }} type={"text"} placeholder={"Enter User Unique ID"} value={userUserUniqueIdSearch} onChange={handleUserUserUniqueIdSearch} />
								<button className="xui-bdr-light-blue xui-w-40 xui-h-40 xui-bdr-rad-circle xui-bg-light-blue xui-ml-half xui-d-flex xui-flex-ai-center xui-flex-jc-center xui-cursor-pointer psc-text" xui-modal-open={`${userUserUniqueIdSearch ? "viewUserDetailsModal" : ""}`}>
									<Search width="16" height="16" />
								</button>
							</div>
						</div>
					</form>
				</div>
			</section>
		</>
	);
}