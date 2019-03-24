export function formatCreateUserInput(
    firstName, lastName, userName, password, email, userType, contactNumber
) {
    return { 
        firstName: JSON.stringify(firstName).replace(/[&\\#,+()$~%'":*?<>{}]/g, ''),
        lastName: JSON.stringify(lastName).replace(/[&\\#,+()$~%'":*?<>{}]/g, ''),
        userName: JSON.stringify(userName).replace(/[&\\#,+()$~%'":*?<>{}]/g, ''),
        password: JSON.stringify(password).replace(/[&\\#,+()$~%'":*?<>{}]/g, ''),
        email: JSON.stringify(email).replace(/[&\\#,+()$~%'":*?<>{}]/g, ''),
        userType: JSON.stringify(userType).replace(/[&\\#,+()$~%'":*?<>{}]/g, ''),
        contactNumber: JSON.stringify(contactNumber).replace(/[&\\#,+()$~%'":*?<>{}]/g, '')
    }
}