 public static class RelationshipObjectMapper
    {


        public static RelationshipObject MapInsertModelToDbModel(RelationshipObjectViewModel model, RelationshipObject newDomainModel = null)
        {
            if (newDomainModel == null)
            {
                newDomainModel = new RelationshipObject();
            }

newDomainModel.ID = model.ID;
newDomainModel.RelationshipMetaID = model.RelationshipMetaID;
newDomainModel.PkAOMFieldObjectID = model.PkAOMFieldObjectID;
newDomainModel.FkAOMFieldObjectID = model.FkAOMFieldObjectID;

            return newDomainModel;
        }



        public static RelationshipObjectViewModel MapDbModelToViewModel(RelationshipObject dbModel)
        {
            var viewModel = new  RelationshipObjectViewModel();
viewModel.ID = dbModel.ID;
viewModel.RelationshipMetaID = dbModel.RelationshipMetaID;
viewModel.PkAOMFieldObjectID = dbModel.PkAOMFieldObjectID;
viewModel.FkAOMFieldObjectID = dbModel.FkAOMFieldObjectID;
            return viewModel;
        }

        public static IQueryable<RelationshipObjectViewModel> MapDbModelQueryToViewModelQuery(IQueryable<RelationshipObject> databaseQuery)
        {
            return databaseQuery.OrderByDescending(c=>c.Id).Select(c => new RelationshipObjectViewModel()
                                             {
                                                 ID = c.ID,
RelationshipMetaID = c.RelationshipMetaID,
PkAOMFieldObjectID = c.PkAOMFieldObjectID,
FkAOMFieldObjectID = c.FkAOMFieldObjectID,
                                             });
        }




}

