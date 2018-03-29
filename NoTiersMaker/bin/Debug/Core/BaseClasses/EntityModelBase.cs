using System;

namespace CustomLogic.Core.BaseClasses
{
    /// <summary>
    /// Custom Identity models can inherit off this class 
    /// </summary>
    public abstract class EntityModelBase
    {
        protected EntityModelBase()
        {
            CreateDateTime = DateTime.UtcNow;
        }

        public int Id { get; set; }
        public DateTime CreateDateTime { get; set; }
    }
}