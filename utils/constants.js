export const emailMessage = ({ user, appointment, action }) => {
  const emails = {
    register: {
      from: "Telecardiology <contact@cardiomuscle.fit>",
      to: `${user.email}`,
      subject: "Account registered",
      text: `Your account has been registered.`,
      html: `
              <p>Dear ${user.name},</p>
              <p>You have successfully registered to Telecardiology<br/> 
              <p>
                Stay Healthy,<br/>
                Anmol Agarwal<br/>
                Telecardiology
              </p>
              `,
    },
    bookAppointment: {
      from: "Telecardiology <contact@cardiomuscle.fit>",
      to: `${user.email}`,
      subject: "Appointment booked",
      text: `Your appointment has been booked.`,
      html: `
				<p>Dear ${user.name},</p>
				<p>Your appointment for <b>${
          appointment?.name
        }</b> has been successfully booked with <b>Dr. ${
        appointment?.doctor?.name
      }</b> on <b>${appointment?.date}</b> at <b>${
        appointment?.timeSlot
      }</b><br/>      
        <p>Test: ${appointment?.testName || "-"}</p>
				<p>
				  Stay Healthy,<br/>
				  Anmol Agarwal<br/>
				  Telecardiology
				</p>
				`,
    },
  };
  return emails[action];
};
