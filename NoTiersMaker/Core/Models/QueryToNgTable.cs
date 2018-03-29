using System;
using System.Linq;
using System.Linq.Expressions;
using Newtonsoft.Json.Linq;

namespace CustomLogic.Core.Models
{
    public class QueryToNgTable<T>
    {
        public int CountAfterFiltering = 0;

        public NgTable<T> ToNgTableDataSet(NgTableParams tableParams, IQueryable<T> dataSet, NgTable<T> results)
        {
            var properties = typeof(T).GetProperties();


            var testing = false;
            if (testing)
            {
                var checkMe = dataSet.Count();
            }


            #region Filtering

            if (tableParams.filter != null)
            {
                string filteringValues = tableParams.filter.ToString();
                JObject jsonFilteringValues = JObject.Parse(filteringValues);

                foreach (var propertyFilter in properties)
                {
                    JToken jId = jsonFilteringValues[propertyFilter.Name];
                    if (jId != null)
                    {
                        var containsSearch = jId.ToString();

                        if (!string.IsNullOrEmpty(containsSearch))
                        {
                            // x
                            ParameterExpression parameter = Expression.Parameter(typeof(T), "x");

                            // x.Name
                            Expression property = Expression.Property(parameter, propertyFilter.Name);


                            #region string

                            if (propertyFilter.PropertyType.FullName == "System.String")
                            // may require changing to a switch
                            {
                                property = Expression.Call(property, "ToLower", null, null);

                                containsSearch = containsSearch.ToLower();

                                Expression target = Expression.Constant(containsSearch);

                                Expression containsMethod = Expression.Call(property, "Contains", null, target);

                                // build the lambda
                                var lambda = Expression.Lambda<Func<T, bool>>(containsMethod, parameter);
                                dataSet = dataSet.Where(lambda);

                            }
                            else if (propertyFilter.PropertyType.FullName == "System.Decimal")
                            {
                                decimal idToSearch = decimal.Parse(containsSearch);
                                //  property = Expression.Call(property, null, null, null);
                                Expression target = Expression.Constant(idToSearch);

                                Expression containsMethod = Expression.Call(property, "Equals", null, target);
                                // build the lambda
                                var lambda = Expression.Lambda<Func<T, bool>>(containsMethod, parameter);
                                dataSet = dataSet.Where(lambda);
                            }
                            else
                            {
                                int idToSearch = int.Parse(containsSearch);
                                //  property = Expression.Call(property, null, null, null);
                                Expression target = Expression.Constant(idToSearch);

                                Expression containsMethod = Expression.Call(property, "Equals", null, target);
                                // build the lambda
                                var lambda = Expression.Lambda<Func<T, bool>>(containsMethod, parameter);
                                dataSet = dataSet.Where(lambda);
                            }

                            #endregion

                        }
                    }
                }
            }

            #endregion Filtering

            #region Sorting

            //  bool userSorted = false;  unused variable commented out 2015-02-19

            if (tableParams.sorting != null)
            {
                string sortingValues = tableParams.sorting.ToString();
                JObject json = JObject.Parse(sortingValues);

                foreach (var property in properties)
                {
                    JToken jId = json[property.Name];
                    if (jId != null)
                    {
                        //  userSorted = true; // yes i have a sort order unused variable commented out 2015-02-19

                        #region Dynamic Linq

                        // x
                        ParameterExpression parameter = Expression.Parameter(typeof(T), "x");

                        // x.Name
                        Expression exProperty = Expression.Property(parameter, property.Name);

                        if (exProperty.Type.ToString() == "System.DateTime")
                        // //  dataSet = dataSet.OrderBy("",Order.) might be able to replace with
                        {
                            var lambda = Expression.Lambda<Func<T, DateTime>>(exProperty, parameter);
                            if (jId.ToString() == "desc")
                            {
                                dataSet = dataSet.OrderByDescending(lambda);
                            }
                            else
                            {
                                dataSet = dataSet.OrderBy(lambda);
                            }
                            break;
                        }
                        else if (exProperty.Type.ToString() == "System.Int32")
                        {
                            var lambda = Expression.Lambda<Func<T, Int32>>(exProperty, parameter);
                            if (jId.ToString() == "desc")
                            {
                                dataSet = dataSet.OrderByDescending(lambda);
                            }
                            else
                            {
                                dataSet = dataSet.OrderBy(lambda);
                            }
                            break;
                        }
                        else if (exProperty.Type.ToString() == "System.Boolean")
                        {

                            var lambda = Expression.Lambda<Func<T, bool>>(exProperty, parameter);
                            if (jId.ToString() == "desc")
                            {
                                dataSet = dataSet.OrderByDescending(lambda);
                            }
                            else
                            {
                                dataSet = dataSet.OrderBy(lambda);
                            }
                            break;
                        }
                        else if (exProperty.Type.ToString() == "System.Decimal")
                        {

                            var lambda = Expression.Lambda<Func<T, decimal>>(exProperty, parameter);
                            if (jId.ToString() == "desc")
                            {
                                dataSet = dataSet.OrderByDescending(lambda);
                            }
                            else
                            {
                                dataSet = dataSet.OrderBy(lambda);
                            }
                            break;
                        }
                        else if (exProperty.Type.ToString() == "System.Nullable`1[System.Int32]")
                        {
                            var lambda = Expression.Lambda<Func<T, Int32?>>(exProperty, parameter);
                            if (jId.ToString() == "desc")
                            {
                                dataSet = dataSet.OrderByDescending(lambda);
                            }
                            else
                            {
                                dataSet = dataSet.OrderBy(lambda);
                            }
                            break;
                        }
                        else
                        {
                            var lambda = Expression.Lambda<Func<T, object>>(exProperty, parameter);
                            if (jId.ToString() == "desc")
                            {
                                dataSet = dataSet.OrderByDescending(lambda);
                            }
                            else
                            {
                                dataSet = dataSet.OrderBy(lambda);
                            }
                            break;
                        }

                        #endregion
                    }
                }
            }
            #endregion sorting

            #region Paging

            int skipAmount = 0;

            if (tableParams.page > 1)
            {
                skipAmount = (tableParams.page - 1) * tableParams.count;
            }
            #endregion

            results.Count = dataSet.Count();
            results.Data = dataSet.Skip(skipAmount).Take(tableParams.count).ToList();

            return results;
        }
    }
}
