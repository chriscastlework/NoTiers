using System;
using System.Collections.Generic;
using System.Linq;

namespace  CustomLogic.Core.Helpers
{
    /// <summary>
    /// This loads all classes inside the projects which implement a certain interface
    /// This does not load classes from other projects
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class InterfaceLoader <T> 
    {
        public List<T> InterfaceImplementations { get; set; }

        public InterfaceLoader()
        {
            this.InterfaceImplementations = GetTypesWithInterface();
        }

        private List<T> GetTypesWithInterface()


        {

            // try to get FactoryForType<T>
            // return types
            // else

            Type lookupType = typeof(T);
            IEnumerable<Type> lookupTypes = GetType().Assembly.GetTypes().Where(
                t => lookupType.IsAssignableFrom(t) && !t.IsInterface);
            return lookupTypes.Select(item => (T) Activator.CreateInstance(item)).ToList();
        }
    }
}
