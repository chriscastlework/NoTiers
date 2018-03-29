using System;

namespace CustomLogic.Services.TasksService
{
public class TasksViewModel 
{

public int Id {get;set;}
public string Name {get;set;}
public int? DealId {get;set;}
public DateTime? DueDate {get;set;}
public bool IsImportant {get;set;}
public int TaskTypeId {get;set;}
public bool IsDone {get;set;}
public string UserId {get;set;}
public DateTime? DateCreated {get;set;}
public DateTime? DateLastModeified {get;set;}
public string CreatedById {get;set;}
public string LastModifiedById {get;set;}
public int ChartX {get;set;}
public int ChartY {get;set;}
public double ChartZoom {get;set;}
public string MeetingName {get;set;}
public DateTime? MeetingDate {get;set;}
public string MeetingLocation {get;set;}
public DateTime? CompletedDate {get;set;}
public int? AccountId {get;set;}
public string Notes {get;set;}
public string ExternalId {get;set;}
public string PendingExternalContacts {get;set;}
public int? SalesProcessId {get;set;}
public int? StageId {get;set;}
public int? CustomTableRowId {get;set;}
public int? CustomObjectRow_Id {get;set;}
public DateTime? FinishDateTime {get;set;}
public int Status {get;set;}
public int? DealContactId {get;set;}
public string RequestByUserId {get;set;}
}
}



