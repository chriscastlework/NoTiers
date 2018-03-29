using System.ComponentModel.DataAnnotations;
using CustomLogic.Core.Models;
using CustomLogic.Services.CustomObjectRowFieldsService;

namespace SpringXBuilder.MVC.PageModels
{
    public class PageBuilderAppsIndex
    {
        public NgTableParams NgTableParams { get; set; }

        [UIHint("NgTableCustomObjectRowFieldsViewModel")]
        public NgTable<CustomObjectRowFieldsViewModel> NgTable { get; set; }
    }
}