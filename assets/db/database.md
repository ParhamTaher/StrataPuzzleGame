## Databse Design

First Planning Meeting:

Agreed on the data format. (Database)

Pattern: {`PID: int`, Name:String, Author: String, EntryNumber:int, Color:String}

                                                  ^ Solution[String]             
	Jack's Comment
	We can figure out entry number from solution. Solution is not unique so we store one of them. We can compile a pattern img from solution list.

User: {`Username: String`, Password: String, Description: String, Patterns: [PID]}

