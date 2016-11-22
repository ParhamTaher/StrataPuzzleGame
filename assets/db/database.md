## Databse Design

First Planning Meeting:

Agreed on the data format. (Database built in MySQL)

Pattern: {`PID: int`, Name:String, Author: String, EntryNumber:int, Color:String}

                                                  ^ Solution[String]             
	Jack's Comment
	We can figure out entry number from solution. Solution is not unique so we store one of them. We can compile a pattern img from solution list.

User: {`Username: String`, Password: String, Description: String, Patterns: [PID]}

Update: 

MySQL does not handle array well like JSON, changes are made to cater the need of many-to-many relation in this application.

Pattern: {`PID: int`, Name:String, Author: String}

Solution: {PID: int, EntryNumber: int, Color: String}	    

User: {`Username: String`, Password: String, Description: String}

UserPattern: {Username: String, PID: int}
