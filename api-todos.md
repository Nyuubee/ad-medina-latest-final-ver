## User Routes
- [ ] GET /users - gets a list of users
- [ ] GET /users/:id - gets a user by id
- [ ] POST /users - Creates a new user
- [ ] PUT /users/:id - Updates a user by id
- [ ] DELETE /users/:id - Deletes a user by id

## Treatment Routes
- [x] GET /treatments - gets a list of treatments
- [x] GET /treatments/:id - gets a treatment by id
- [ ] POST /treatments - Creates a new treatment
- [ ] PUT /treatments/:id - Updates a treatment by id
- [ ] DELETE /treatments/:id - Deletes a treatment by id

## Payment Routes
- [x] GET /payments - gets a list of payments
- [x] GET /payments/:id - gets a payment by id
- [-] POST /payments - Creates a new payment
- [ ] PUT /payments/:id - Updates a payment by id
- [ ] DELETE /payments/:id - Deletes a payment by id

## dentist Routes
- [x] GET /dentists - gets a list of dentists
- [x] GET /dentists/:id - gets a dentist by id
- [ ] POST /dentists - Creates a new dentist
- [ ] PUT /dentists/:id - Updates a dentist by id
- [ ] DELETE /dentists/:id - Deletes a dentist by id
- [-] GET /dentists/:id/treatments - gets a list of treatments performed by a dentist
- [ ] GET /dentists/:id/dental-records - gets a list of dental records made by a dentist

## Patient Routes
- [x] GET /patients - gets a list of patients
- [x] GET /patients/:id - gets a patient by id
- [ ] POST /patients - Creates a new patient
- [ ] PUT /patients/:id - Updates a patient by id
- [ ] DELETE /patients/:id - Deletes a patient by id
- [x] GET /patients/:id/treatments - gets a list of treatments for a patient
- [ ] GET /patients/:id/treatments/unpaid - gets a list of unpaid treatments for a patient
- [-] GET /patients/:id/dental-records - gets a list of dental records for a patient

## Dental Record Routes
- [-] GET /dental-records - gets a list of dental records
- [-] GET /dental-records/:id - gets a dental record by id
- [ ] POST /dental-records - Creates a new dental record
- [ ] PUT /dental-records/:id - Updates a dental record by id
- [ ] DELETE /dental-records/:id - Deletes a dental record by id
