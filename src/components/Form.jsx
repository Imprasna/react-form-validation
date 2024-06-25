import React, { Fragment, useEffect, useState } from "react";
import '../styles/view.css';
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Loader from "../util/Loader";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Modal from './Modal';
import 'bootstrap/dist/css/bootstrap.min.css';

function FormComponent() {
	const [users, setUsers] = useState([]); 
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [individualData, setIndividualData] = useState(null);
	const [show, setShow] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [response, setResponse] = useState(null);
	const [phoneNumber1, setPhoneNumber1] = useState("");
	const [phoneNumber2, setPhoneNumber2] = useState("");
	const [phoneNumber3, setPhoneNumber3] = useState("");
	const [emailError, setEmailError] = useState("");
	const [isEditing, setIsEditing] = useState(false);
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [validationError, setValidationError] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		zipCode: "",
		country: "",
		qualification: "",
		comments: "",
	});

	// Resetting Form
	const resetForm = () => {
		setFormData({
			firstName: "",
			lastName: "",
			email: "",
			phoneNumber: "",
			address1: "",
			address2: "",
			city: "",
			state: "",
			zipCode: "",
			country: "",
			qualification: "",
			comments: "",
		});
		setPhoneNumber1("");
		setPhoneNumber2("");
		setPhoneNumber3("");
		setEmailError("");
	};

	// Fetching data
	const fetchingAllData = () => {
		axios.get("http://54.202.218.249:9501/api/users")
			.then((response) => {
				setUsers(response.data);
				setLoading(false);
			})
			.catch((error) => {
				setError(error);
				setLoading(false);
			});
	};

	useEffect(() => {
		fetchingAllData();
	}, []);

	// Validating email
	const validateEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	const textOnlyPattern = /^[A-Za-z\s]+$/;

	// Setting form values
	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "email") {
			if (!validateEmail(value)) {
				setEmailError("Please enter a valid email address.");
			} else {
				setEmailError("");
			}
		}

		if (name === 'firstName' || name === 'lastName' || name === 'city' || name === 'state' || name === 'country') { 
			if (textOnlyPattern.test(value) || value === '') {
				setValidationError('');
			} else {
				setValidationError('City name can only contain letters.');
			}
		}



		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Phone function
	const handlePhoneChange = (e) => {
		const numberPattern = /^[0-9]*$/;

		const { name, value } = e.target;

		if (numberPattern.test(value)) {
			if (name === "phoneNumber1") {
				setPhoneNumber1(value);
			} else if (name === "phoneNumber2") {
				setPhoneNumber2(value);
			} else if (name === "phoneNumber3") {
				setPhoneNumber3(value);
			}
			setValidationError('');
		} else {
			setValidationError('Phone number can only be numbers');
		}
	};

	// Handling From submit functionality
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const combinedPhoneNumber = `${phoneNumber1}-${phoneNumber2}-${phoneNumber3}`;

		const dataToSubmit = {
			...formData,
			phoneNumber: combinedPhoneNumber,
		};

		try {
			if (isEditing && selectedUserId) {
				const res = await axios.put(`http://54.202.218.249:9501/api/users/${selectedUserId}`, dataToSubmit);
				setResponse(res.data);
				setShowAlert(true);
				fetchingAllData();
			} else {
				const res = await axios.post("http://54.202.218.249:9501/api/users", dataToSubmit);
				setResponse(res.data);
				setShowAlert(true);
				fetchingAllData();
			}

			resetForm();
			setIsLoading(false);
		} catch (err) {
			setError(err.message);
			setIsLoading(false);
		}
	};

	const handleEdit = (userData) => {
		setFormData({
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			phoneNumber1: userData.phoneNumber.split("-")[0],
			phoneNumber2: userData.phoneNumber.split("-")[1],
			phoneNumber3: userData.phoneNumber.split("-")[2],
			address1: userData.address1,
			address2: userData.address2,
			city: userData.city,
			state: userData.state,
			zipCode: userData.zipCode,
			country: userData.country,
			qualification: userData.qualification,
			comments: userData.comments,
		});
		setPhoneNumber1(userData.phoneNumber.split("-")[0]);
		setPhoneNumber2(userData.phoneNumber.split("-")[1]);
		setPhoneNumber3(userData.phoneNumber.split("-")[2]);
		setIsEditing(true);
		setSelectedUserId(userData?.id);
	};

	if (loading) {
		return <Loader />;
	}

	if (error) {
		return <p>Error: {error.message}</p>;
	}

	// Viewing Data
	const viewUserData = async (userId) => {
		await axios
			.get(`http://54.202.218.249:9501/api/users/${userId?.id}`)
			.then((response) => {
				setIndividualData(response?.data);
				setShow(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	// Deleting Data
	const deleteUserData = (userId) => {
		axios
			.delete(`http://54.202.218.249:9501/api/users/${userId?.id}`)
			.then((response) => {
				fetchingAllData();
				setShowDeleteAlert(true);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<Fragment>
			<Container fluid>
				<Row>
					<Col xs={12} sm={12} md={12} lg={5} xl={5}>
						<div className="register">
							<h1 className="title"><strong>Bio Data</strong></h1>

							<Form role="form" onSubmit={handleSubmit}>
							{showAlert && (
								<Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
									Data {isEditing ? "Updated" : "Submitted"} successfully
								</Alert>
							)}
								<div className="form-group">
									<Form.Label className="reg_txt">Name <span>*</span></Form.Label>
									<div className="controls form-inline">
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="firstName" className="input-name" value={formData.firstName} onChange={handleChange} placeholder="First Name" required isInvalid={!!validationError} />
										</Form.Group>
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="lastName" className="input-name" value={formData.lastName} onChange={handleChange} placeholder="Last Name" required isInvalid={!!validationError} />
										</Form.Group>
									</div>
								</div>
								<div className="clearfix"></div>

								<div className="form-group">
									<Form.Label className="reg_txt">Email <span>*</span></Form.Label>
									<Form.Control type="text" name="email" className="form-register text" value={formData.email} onChange={handleChange} placeholder="E-mail" required isInvalid={!!emailError} />
								</div>

								<div className="clearfix"></div>

								<div className="form-group" style={{ height: "70px" }}>
									<Form.Label className="reg_txt">Phone Number <span>*</span></Form.Label>
									<div className="clearfix"></div>
									<div className="wsite-form">
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="phoneNumber1" minLength={3} maxLength={3} placeholder="123" value={phoneNumber1} onChange={handlePhoneChange} className="text input-name1" required isInvalid={!!emailError} />
										</Form.Group>
									</div>
									<div className="line">-</div>
									<div className="wsite-form">
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="phoneNumber2" minLength={4} maxLength={4} placeholder="4567" value={phoneNumber2} onChange={handlePhoneChange} className="text input-name1" required isInvalid={!!emailError} />
										</Form.Group>
									</div>
									<div className="line">-</div>
									<div className="wsite-form">
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="phoneNumber3" minLength={3} maxLength={3} placeholder="890" value={phoneNumber3} onChange={handlePhoneChange} className="text input-name1" required isInvalid={!!emailError} />
										</Form.Group>
									</div>
								</div>

								<div className="clearfix"></div>

								<div className="form-group">
									<Form.Label className="reg_txt">Address <span>*</span></Form.Label>
									<Form.Group controlId="validationCustom03">
										<Form.Control type="text" name="address1" className="form-register text" value={formData.address1} onChange={handleChange} placeholder="Line 1" style={{ marginBottom: "15px" }} required />
									</Form.Group>
									<Form.Group controlId="validationCustom03">
										<Form.Control type="text" name="address2" className="form-register text" value={formData.address2} onChange={handleChange} placeholder="Line 2" style={{ marginBottom: "15px" }} required />
									</Form.Group>
								</div>

								<div className="form-group">
									<div className="controls form-inline">
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="city" className="input-name" value={formData.city} onChange={handleChange} placeholder="City" required isInvalid={!!validationError} />
										</Form.Group>
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="state" className="input-name" value={formData.state} onChange={handleChange} placeholder="State" required isInvalid={!!validationError} />
										</Form.Group>
									</div>
								</div>

								<div className="form-group">
									<div className="controls form-inline">
										<Form.Control type="number" name="zipCode" className="input-name" value={formData.zipCode} onChange={handleChange} placeholder="Zip Code" required />
										<Form.Group controlId="validationCustom03">
											<Form.Control type="text" name="country" className="input-name" value={formData.country} onChange={handleChange} placeholder="Country" required isInvalid={!!validationError} />
										</Form.Group>
									</div>
								</div>

								<div className="form-group">
									<Form.Label className="reg_txt">Write Your Qualification <span>*</span></Form.Label>
									<Form.Control type="text" name="qualification" className="form-register text" placeholder="Qualification" value={formData.qualification} onChange={handleChange} style={{ marginBottom: "15px" }} required />
								</div>
								<div className="clearfix"></div>

								<div className="form-group">
									<Form.Label className="reg_txt">Comment <span>*</span></Form.Label>
									<Form.Control as="textarea" name="comments" placeholder="Comment" value={formData.comments} onChange={handleChange} className="form-register text" required />
								</div>

								<div className="form-group">
									<Button type="submit" disabled={isLoading} className="btn btn-default submit" style={{ width: "97%" }}>
										{isEditing ? "Update" : "Submit"} {isLoading ? "Loading…" : null}
									</Button>
								</div>
							</Form>
						</div>
					</Col>
					<Col xs={12} sm={12} md={12} lg={7} xl={7}>
						<div className="tabt">
							<table className="table">
								<tbody>
									<tr className="ztxt">
										<th>Name</th>
										<th>Email</th>
										<th>Phone</th>
										<th>Edit</th>
										<th>Delete</th>
										<th>View</th>
									</tr>
									{users &&
										users?.map((item, index) => (
											<Fragment key={index}>
												<tr>
													<td>{item?.firstName} {item?.lastName}</td>
													<td>{item?.email}</td>
													<td>{item?.phoneNumber}</td>
													<td><button className="ed" onClick={() => handleEdit(item)}>Edit</button></td>
													<td><button className="ed" style={{ background: "#f00" }} onClick={() => deleteUserData(item)}>Delete</button></td>
													<td><button className="ed" style={{ background: "#000" }} onClick={() => viewUserData(item)}>View</button></td>
												</tr>
											</Fragment>
										))}
								</tbody>
							</table>
							{individualData && (
								<Modal individualData={individualData} show={show} setShow={setShow} />
							)}
						</div>
						{showDeleteAlert && (
							<Alert variant="success" onClose={() => setShowDeleteAlert(false)} dismissible>
								Data deleted successfully
							</Alert>
						)}
					</Col>
				</Row>
			</Container>
		</Fragment>
	);
}

export default FormComponent;
