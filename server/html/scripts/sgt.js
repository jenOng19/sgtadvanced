


class SGT_template{
	/* constructor - sets up sgt object 
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements it this object
		- Additionally, will generate an object to store created students 
		  who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor( elementConfig ){
		
		this.domElements=elementConfig;
		console.log('Element config passed in model from SGT_template: ', this.domElements)
		this.data={
			//id: Studentobj
		};

		

		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel= this.handleCancel.bind(this);
		this.deleteStudent=this.deleteStudent.bind(this);
		this.handleGetData=this.handleGetData.bind(this);
		this.handleGetDataSuccess = this.handleGetDataSuccess.bind(this);
		this.handleCreateDataSuccess=this.handleCreateDataSuccess.bind(this);
		this.handleDeleteDataSuccess=this.handleDeleteDataSuccess.bind(this);
	}
	/* addEventHandlers - add event handlers to premade dom elements
	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers(){
		$('#addButton').click(this.handleAdd);
		$('#cancelButton').click(this.handleCancel);
		$('#getDataButton').click(this.handleGetData);
		// $('#close').click(this.closeModal)
	}

	// closeModal(){
	// 	$('#modal').toggleClass('hide');
	// }
	/* clearInputs - take the three inputs stored in our constructor and clear their values
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	clearInputs(){
		this.domElements.nameInput.val("");
		this.domElements.courseInput.val("");
		this.domElements.gradeInput.val("");
	}
	/* handleCancel - function to handle the cancel button press
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel(){
		this.clearInputs();
	}
	/* handleAdd - function to handle the add button click
	purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd(){
		var name =this.domElements.nameInput.val();
		var course=this.domElements.courseInput.val();
		var grade=this.domElements.gradeInput.val();
		this.createStudentFromForm(name, course, grade);
		//this.displayAllStudents();
		
	}
	/* displayAllStudents - iterate through all students in the model
	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllStudents(){
		$('#displayArea').empty();
		for(var student in this.data){
			this.data[student].render();
		}
		this.displayAverage();
	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage(){
		var counter=0;
		var total=0;

		for(var key in this.data){
			total+=this.data[key].getData().grade;
			counter++
		}

		$(".avgGrade").text((total/counter).toFixed(2))
		
	}
	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/

	createStudentFromForm(name, course, grade){
		this.handleCreateData(name, course, grade);
	}
	createStudent(name, course, grade, id){
		if(name && course && grade ){
			var newStudent=new Student(id, name, course, grade, this.deleteStudent);
			this.data[id]=newStudent;
			// return true;
		}
	}
			 
	
	/* doesStudentExist - 
		determines if a student exists by ID.  returns true if yes, false if no
	purpose: 
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: 
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id){
		if(this.data.hasOwnProperty(id)){
			return true;
		}
		else{
			return false;
		}
	}
	/* readStudent - 
		get the data for one or all students
	purpose: 
			determines if ID is given or not
			if ID is given, return the student by that ID, if present
			if ID is not given, return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
	readStudent(id){
		var students=[];
		
		if (id === undefined){
			students=Object.values(this.data);
			console.log(students)
			return students;
		}
		else if(id !== undefined){
			if(this.doesStudentExist(id)){
				return this.data[id];
			}else{
				return false;
			}
		}	
	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to
	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(id, field, value){
		if(this.doesStudentExist(id)){
			this.data[id].update(field, value);
			return true;
		}else{
			return false;
		}
	}
	/* deleteStudent - 
		delete the given student at the given id
	purpose: 
			determine if the ID exists in this.data
			remove it from the object
			return true if successful, false if not
			this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteStudent(id, row){
		this.handleDeleteData(id, row);
		// if(this.doesStudentExist(id)){
		// 	delete this.data[id];
		// 	return true;
		// }else{
		// 	return false
		// }
	}

	handleError(response){
		debugger;
		// if(response.errors){
		// 	var messages=null;
		// 	for(var errorIndex=0; errorIndex<response.errors.length;errorIndex++){
		// 		messages +=response.errors[errorIndex]+ ""
		// 	}
			$('#modal').toggleClass('show');
		// }
	}
	
	handleGetData(){
		var ajaxConfig = {
			dataType: 'json',
			data:{"api_key": "FDTbESioTh"},
			method: 'get',
			url: 'api/grades',
			success: this.handleGetDataSuccess,
			error: this.handleError
		}
		$.ajax(ajaxConfig);
	}

	handleGetDataSuccess(response) {
		console.log("response:" ,response);
		if(response.success){
			this.data = {};
			for(var key= 0; key<response.data.length; key++){
				var students=response.data[key];
				this.createStudent(students.name, students.course, students.grade, students.id);
			}
			this.displayAllStudents();
		} else {
			this.handleError();
		}
	}

	handleCreateData(name, course, grade){
		var ajaxConfig = {
			dataType: 'json',
			data:{
				"api_key": "FDTbESioTh",
				"name": name,
				"course": course,
				"grade": grade
			},
			method: 'post',
			url: 'api/grades',
			success: this.handleCreateDataSuccess,
			error: this.handleError
		}
		$.ajax(ajaxConfig);
	}

	// handleCreateData(name, course, grade){
	// 	var ajaxConfig = {
	// 		dataType: 'json',
	// 		data:{
	// 			"api_key": "FDTbESioTh",
	// 			"name": name,
	// 			"course": course,
	// 			"grade": grade,
	// 			"force-failure": 'server'
	// 		},
	// 		method: 'post',
	// 		url: 'http://s-apis.learningfuze.com/sgt/delete',
	// 		success: this.handleCreateDataSuccess,
	// 		error: this.handleError
	// 	}
	// 	$.ajax(ajaxConfig);
	// }


	handleCreateDataSuccess(response){
		if(response.success){
			this.clearInputs();
			this.handleGetData();
		}else{
			this.handleError;
		}
		
	}

	// handleCreateDataSuccess(response){
	// 	if(response.success){
	// 		this.clearInputs();
	// 		this.handleGetData();
	// 	}else{
	// 		this.handleError;
	// 	}
		
	// }

	handleDeleteData(id, row){
		var ajaxConfig = {
			dataType: 'json',
			// data:{
			// 	"api_key": "FDTbESioTh",
			// 	"student_id": id
			// },
			method: 'delete',
			url: '/api/grades?student_id=' +id,
			success: this.handleDeleteDataSuccess,
			// success: handleDeleteDataSuccess.bind(this),
			error: this.handleError
		}
		$.ajax(ajaxConfig);

		// function handleDeleteDataSuccess(response){
		// 	if(response.success){
		// 		row.remove();

		// 		// this.handleGetData();
		// 	}
		// }
	}

	handleDeleteDataSuccess(response){
		if(response.success){
			this.handleGetData();
		}else{
			this.handleError
		}
	}
}

