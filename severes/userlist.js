const sql = require("../db");
const moment = require('moment');
// constructor  
class users {

  static get(result) {
    sql.query("SELECT * FROM users  WHERE isActive='1'", (err, users) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        // Convert date format for each user
        users.forEach(user => {
            
            user.date = moment(user.date).format('YYYY-MM-DD');
            user.updatedAt = moment(user.updatedAt).format('YYYY-MM-DD HH:mm');
            user.createdAt = moment(user.createdAt).format('YYYY-MM-DD HH:mm');
        });
        result(null, { status: true, message: "Users Copy Get successfully!", users: users });
    });
}
 
static getById(id, result) {
    sql.query("SELECT * FROM users WHERE isActive='1' AND id = ?", [id], (err, user) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (user.length === 0) {
            result({ message: "User not found" }, null);
            return;
        }

        // Format dates for the user
        let entry = user[0]; // Access the first and only user
        entry.date = moment(entry.date).format('YYYY-MM-DD');
        entry.updatedAt = moment(entry.updatedAt).format('YYYY-MM-DD HH:mm');
        entry.createdAt = moment(entry.createdAt).format('YYYY-MM-DD HH:mm');

        result(null, { status: true, message: "User fetched successfully", users: entry });
    });
}


  static create(fristname, lastname, phone, eMail, address, result) {
    sql.query('SELECT * FROM users WHERE eMail = ?', [eMail], async (error, results) => {
        if (error) {
            console.log("error: ", error);
            return result(error, null);
        }

        if (results.length > 0) {
            return result(null, { status: false, message: "eMail is already registered" }, 401);
        }

        // If the eMail is not already registered, proceed to insert the new user
        sql.query("INSERT INTO users (fristname, lastname, phone, eMail, address) VALUES (?, ?, ?, ?,?)", 
            [fristname, lastname, phone, eMail, address], 
            (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return result(err, null);
                }
                
                // Return the newly created user
                return result(null, {
                    status: true,
                    message: "User created successfully!",
                    user: { id:res.insertId,fristname, lastname, phone, eMail, address}
                });
            }
        );
    });
}

static updateById(id,fristname, lastname, phone, eMail, address, result) {
  // Check if the eMail is already registered
  sql.query('SELECT * FROM users WHERE eMail = ? AND id != ?', [eMail, id], async (error, results) => {
      if (error) {
          console.log("Error checking eMail registration:", error);
          return result(error, null);
      }

      if (results.length > 0) {
          return result(null, { status: false, message: "eMail is already registered" }, 401);
      }

      // Update the user if the eMail is not already registered
      sql.query("UPDATE users SET fristname = ?, lastname = ? , phone = ? ,  eMail = ?, address = ? WHERE id = ?", 
          [fristname, lastname, phone, eMail, address, id], 
          (err, res) => {
              if (err) {
                  console.log("Error updating user:", err);
                  return result(err, null);
              }
              
              // Return success message
              return result(null, {
                  status: true,
                  message: "User updated successfully!",
                  users: { id, fristname, lastname, phone, eMail, address }
              });
          }
      );
  });
}



  DELETE
  static remove(id, result) {
    sql.query("UPDATE users SET isActive = 0 WHERE id = ? AND isActive='1'", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Tp FOllow with the id
        result("Not Found", null, 404);
        return;
      }
      result(null, {
        status: true,
        message: "users Copy Deleted successfully!",
      });
    });
  }

}

module.exports = users;