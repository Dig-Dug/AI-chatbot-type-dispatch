// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

class UserProfile {
    constructor(transport, name, age, password, message,benutzerName) {
        this.benutzerName = benutzerName;
        this.password = password;
        this.transport = transport;
        this.name = name;
        this.age = age;
        this.message = message;
     
    }
}

module.exports.UserProfile = UserProfile;
