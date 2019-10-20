# carpool-api
Api implementation for carpool-confirmer

Api has been developed using serverless and is running on https://d7jtotvg61.execute-api.us-east-1.amazonaws.com/dev/

The available endpoints are: 

- `POST /ride`: Starts a new carpool ride. Requires location as parameter.
- `GET /ride/:id`: Gets the ride.
- `POST /ride/:id/scan-passenger`: Called when the passenger scans the driver's QR code. Requires location as parameter.
- `GET /ride/:id/confirm-driver`: Confirms the ride has been completed by the driver.
- `GET /ride/:id/confirm-passenger`: Confirms the ride has been completed by the passenger.