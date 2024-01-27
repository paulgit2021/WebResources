function onBPFStageChange(executionContext) {
	// Get the form context
	var formContext = executionContext.getFormContext();

	// Get the active Business Process Flow
	var activeBPF = formContext.data.process.getActiveProcess();

	// Check if a Business Process Flow is active
	if (activeBPF) {
		// Get the direction of the Business Process Flow
		var direction = activeBPF.getDirection();

		// 'Next' indicates forward direction, 'Previous' indicates backward direction
		alert("BPF Direction: " + direction);
	} else {
		alert("No active Business Process Flow.");
	}
}
Xrm.Page.data.process.addOnStageChange(onBPFStageChange);


function GettingSubgridData(executionContext)
{
	var Data = "";
	//Initiating Form Context.
	var formContext = executionContext.getFormContext();
	//Retrieving Value From Field.
	var Input = formContext.getAttribute("cr22e_accountinfo").getValue();
	if (Input)
	{
		//Collecting Subgrid Context.
		var gridContext = formContext.getControl("account_detail");
		//Collecting Subgrid Rows.
		var myRows = gridContext.getGrid().getRows();
		//Obtaining Total Row Count.
		var RowCount = myRows.getLength();
		//Iterating Through Subgrid Rows.
		for (var i = 0; i < RowCount; i++)
		{
			//Obtaining A Single Row Data.
			var gridRowData = myRows.get(i).getData();
			//Obtaining Row Entity Object.
			var entity = gridRowData.getEntity();
			//Collecing Row EntityRefrence.
			var entityReference = entity.getEntityReference();
			//Adding Up Row Data In A Variable.
			Data += entityReference.name + "\n";
		}
		//Setting Value In Field.
		formContext.getAttribute("description").setValue(Data);
	}
	else if (Input == false)
	{
		//Clearning Value Of Field.
		formContext.getAttribute("description").setValue("");
	}
}

function getTotalAmount(executionContext)
{
	var formContext = executionContext.getFormContext();
	//Retrieving Value From Field.
	var total = 0;
	var Input = formContext.getAttribute("cr5a3_totalamount").getValue();
	if (Input)
	{
		//Collecting Subgrid Context.
		var gridContext = formContext.getControl("Originatingleads");
		//Collecting Subgrid Rows.
		var rows = gridContext.getGrid().getRows();
		//Obtaining Total Row Count.
		var RowCount = rows.getLength();
		for (var index = 0; index < RowCount; index++)
		{ // Get the data of the row
			var data = rows.get(index).getData();
			// Get the entity of the row
			var entity = data.getEntity();
			// Get the estimated revenue attribute of the entity
			var estimatedRevenue = entity.attributes.get("estimatedvalue");
			// Check if the attribute exists and has a value      
			if (estimatedRevenue && estimatedRevenue.getValue())
			{
				// Add the value to the total
				total += estimatedRevenue.getValue();
			}
		}
		if (Xrm.Navigation && Xrm.Navigation.openConfirmDialog)
		{
			var confirmStrings = {
				text: "The total amount of all opportunities is " + total,
				title: "Confirmation Dialog"
			};
			var confirmOptions = {
				height: 200,
				width: 450
			};
			Xrm.Navigation.openConfirmDialog(confirmStrings, confirmOptions).then(

			function (success)
			{
				if (success.confirmed)
				{
					console.log("Dialog closed using OK button.");
				}
				else
				{
					console.log("Dialog closed using Cancel button or X.");
				}
			});
		}
	}
}
//Update Record
function ChangetoContacted(SelectedcontrolItemIds, statusValue)
{

for(var i=0;i<SelectedcontrolItemIds.length; i++)
{
        recordId=SelectedcontrolItemIds[i];
		var record = {};
record.statuscode = statusValue; // Status

var req = new XMLHttpRequest();
req.open("PATCH", Xrm.Utility.getGlobalContext().getClientUrl() + "/api/data/v9.2/leads("+recordId+")", false);
req.setRequestHeader("OData-MaxVersion", "4.0");
req.setRequestHeader("OData-Version", "4.0");
req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
req.setRequestHeader("Accept", "application/json");
req.setRequestHeader("Prefer", "odata.include-annotations=*");
req.onreadystatechange = function () {
	if (this.readyState === 4) {
		req.onreadystatechange = null;
		if (this.status === 204) {
			console.log("Record is updated");
		} else {
			console.log(this.responseText);
		}
	}
};
req.send(JSON.stringify(record));
		
		
}
}
// Register the function on the BPF stage change event
Xrm.Page.data.process.addOnStageChange(onBPFStageChange);