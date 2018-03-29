using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CustomLogic.SchemaBuilder.MicrosoftSQL.SchemaModels;
using CustomLogic.Templates.Interfaces;

namespace CustomLogic.Factory
{
    public class TemplateFactory<T> 
    {
        /// <summary>
        /// Returns all templates that are of type of constuctor as IModelInfoTemplate all template classes must inherit IModelInfoTemplate to use this function
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public List<IModelInfoTemplate> GetModelInfoTemplates(ModelInfo data)
        {
            Type lookupType = typeof(T);
            IEnumerable<Type> lookupTypes = GetType().Assembly.GetTypes().Where(
                t => lookupType.IsAssignableFrom(t) && !t.IsInterface);
            List<IModelInfoTemplate> templatesList = lookupTypes.Select(item => (IModelInfoTemplate)Activator.CreateInstance(item, data)).ToList(); // get No tier templates
            int id = 1;

            foreach (var template in templatesList.OrderBy(c => c.GetClassName()))
            {
                template.SetClassId(id);
                id++;
            }

            return templatesList;
        }

    }
}
