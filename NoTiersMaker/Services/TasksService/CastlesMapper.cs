using System.Linq;
using System.Linq.Dynamic;
using CustomLogic.LegacyDatabase;

namespace CustomLogic.Services.TasksService
{
 public static class TasksMapper
    {


        public static Task MapInsertModelToDbModel(TasksViewModel model, Task newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new Task();
            }

newDomainModel.Id = model.Id;
newDomainModel.Name = model.Name;
newDomainModel.DealId = model.DealId;
newDomainModel.DueDate = model.DueDate;
newDomainModel.IsImportant = model.IsImportant;
newDomainModel.TaskTypeId = model.TaskTypeId;
newDomainModel.IsDone = model.IsDone;
newDomainModel.UserId = model.UserId;
newDomainModel.DateCreated = model.DateCreated;
newDomainModel.DateLastModeified = model.DateLastModeified;
newDomainModel.CreatedById = model.CreatedById;
newDomainModel.LastModifiedById = model.LastModifiedById;
newDomainModel.ChartX = model.ChartX;
newDomainModel.ChartY = model.ChartY;
newDomainModel.ChartZoom = model.ChartZoom;
newDomainModel.MeetingName = model.MeetingName;
newDomainModel.MeetingDate = model.MeetingDate;
newDomainModel.MeetingLocation = model.MeetingLocation;
newDomainModel.CompletedDate = model.CompletedDate;
newDomainModel.AccountId = model.AccountId;
newDomainModel.Notes = model.Notes;
newDomainModel.ExternalId = model.ExternalId;
newDomainModel.PendingExternalContacts = model.PendingExternalContacts;
newDomainModel.SalesProcessId = model.SalesProcessId;
newDomainModel.StageId = model.StageId;
newDomainModel.CustomTableRowId = model.CustomTableRowId;
newDomainModel.CustomObjectRowId = model.CustomObjectRow_Id;
//newDomainModel.FinishDateTime = model.FinishDateTime;
// newDomainModel = model.Status;
// newDomainModel.con = model.DealContactId;
// newDomainModel.re = model.RequestByUserId;

            return newDomainModel;
        }



        public static TasksViewModel MapDbModelToViewModel(Task dbModel)
        {
            var viewModel = new  TasksViewModel();
viewModel.Id = dbModel.Id;
viewModel.Name = dbModel.Name;
viewModel.DealId = dbModel.DealId;
viewModel.DueDate = dbModel.DueDate;
viewModel.IsImportant = dbModel.IsImportant;
viewModel.TaskTypeId = dbModel.TaskTypeId;
viewModel.IsDone = dbModel.IsDone;
viewModel.UserId = dbModel.UserId;
viewModel.DateCreated = dbModel.DateCreated;
viewModel.DateLastModeified = dbModel.DateLastModeified;
viewModel.CreatedById = dbModel.CreatedById;
viewModel.LastModifiedById = dbModel.LastModifiedById;
viewModel.ChartX = dbModel.ChartX;
viewModel.ChartY = dbModel.ChartY;
viewModel.ChartZoom = dbModel.ChartZoom;
viewModel.MeetingName = dbModel.MeetingName;
viewModel.MeetingDate = dbModel.MeetingDate;
viewModel.MeetingLocation = dbModel.MeetingLocation;
viewModel.CompletedDate = dbModel.CompletedDate;
viewModel.AccountId = dbModel.AccountId;
viewModel.Notes = dbModel.Notes;
viewModel.ExternalId = dbModel.ExternalId;
viewModel.PendingExternalContacts = dbModel.PendingExternalContacts;
viewModel.SalesProcessId = dbModel.SalesProcessId;
viewModel.StageId = dbModel.StageId;
//viewModel.CustomTableRowId = dbModel.CustomTableRowId;
//viewModel.CustomObjectRow_Id = dbModel.CustomObjectRowId;
//viewModel.FinishDateTime = dbModel.FinishDateTime;
//viewModel.Status = dbModel.Status;
//viewModel.DealContactId = dbModel.DealContactId;
//viewModel.RequestByUserId = dbModel.RequestByUserId;
            return viewModel;
        }

        public static IQueryable<TasksViewModel> MapDbModelQueryToViewModelQuery(IQueryable<Task> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new TasksViewModel()
                                             {
                                                 Id = c.Id,
Name = c.Name,
DealId = c.DealId,
DueDate = c.DueDate,
IsImportant = c.IsImportant,
TaskTypeId = c.TaskTypeId,
IsDone = c.IsDone,
UserId = c.UserId,
DateCreated = c.DateCreated,
DateLastModeified = c.DateLastModeified,
CreatedById = c.CreatedById,
LastModifiedById = c.LastModifiedById,
ChartX = c.ChartX,
ChartY = c.ChartY,
ChartZoom = c.ChartZoom,
MeetingName = c.MeetingName,
MeetingDate = c.MeetingDate,
MeetingLocation = c.MeetingLocation,
CompletedDate = c.CompletedDate,
AccountId = c.AccountId,
Notes = c.Notes,
ExternalId = c.ExternalId,
PendingExternalContacts = c.PendingExternalContacts,
SalesProcessId = c.SalesProcessId,
StageId = c.StageId,
//CustomTableRowId = c.CustomTableRowId,
//CustomObjectRow_Id = c.CustomObjectRow_Id,
// FinishDateTime = c.FinishDateTime,
//Status = c.Status,
//DealContactId = c.DealContactId,
//RequestByUserId = c.RequestByUserId,
                                             });
        }




}
}
