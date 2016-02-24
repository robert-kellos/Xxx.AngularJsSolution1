using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LinqKit;
using System.Linq.Expressions;
using System.Reflection;

namespace Xxx.AngularJsSolution1.Data.Extensions
{
    public static class Extensions
    {
        /// <summary>
        /// Generic equal expression method
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="propertyName"></param>
        /// <param name="searchValue"></param>
        /// <returns></returns>
        public static Expression<Func<T, bool>> GetEqualExpression<T>(string propertyName, string searchValue)
        {
            var parameterExp = Expression.Parameter(typeof(T), "type");
            var propertyExp = Expression.Property(parameterExp, propertyName);
            MethodInfo method = typeof(string).GetMethod("Equals", new[] { typeof(string) });
            var someValue = Expression.Constant(searchValue, typeof(string));
            var equalMethodExp = Expression.Call(propertyExp, method, someValue);
            return Expression.Lambda<Func<T, bool>>(equalMethodExp, parameterExp);
        }

        /// <summary>
        /// Generic contains expression method
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="searchCriteria"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        public static Expression<Func<T, bool>> GetContainsExpression<T>(string searchCriteria, string value)
        {
            var parameterExp = Expression.Parameter(typeof(T), "type");
            var propertyExp = Expression.Property(parameterExp, searchCriteria);
            MethodInfo method = typeof(string).GetMethod("Contains", new[] { typeof(string) });
            var someValue = Expression.Constant(value, typeof(string));
            var equalMethodExp = Expression.Call(propertyExp, method, someValue);
            return Expression.Lambda<Func<T, bool>>(equalMethodExp, parameterExp);
        }
        /// <summary>
        /// To check whether the property string value contains the search term
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="stringProperty"></param>
        /// <param name="searchValue"></param>
        /// <returns></returns>
        public static IQueryable<T> WhereStringContains<T>(this IQueryable<T> query,
                                                           Expression<Func<T, string>> stringProperty,
                                                           string searchValue)
        {
            if (string.IsNullOrEmpty(searchValue))
            {
                return query;
            }
            var isNotNullExpression = Expression.NotEqual(stringProperty.Body, Expression.Constant(null));
            //Create expression to represent T.[property].Contains(searchTerm)
            var searchTermExpression = Expression.Constant(searchValue);
            var checkEqualsExpression = Expression.Call(stringProperty.Body, typeof(string).GetMethod("Contains"), searchTermExpression);
            var notNullAndContainsExpression = Expression.AndAlso(isNotNullExpression, checkEqualsExpression);
            //Build final expression
            var methodCallExpression = Expression.Call(typeof(Queryable),
                                                       "Where",
                                                       new Type[] { query.ElementType },
                                                       query.Expression,
                                                       Expression.Lambda<Func<T, bool>>(notNullAndContainsExpression, stringProperty.Parameters).Expand());

            return query.Provider.CreateQuery<T>(methodCallExpression);
        }

        /// <summary>
        /// To check whether the property string value contains the search term
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="intProperty"></param>
        /// <param name="searchValue"></param>
        /// <returns></returns>
        public static IQueryable<T> WhereIntEquals<T>(this IQueryable<T> query,
                                                      Expression<Func<T, int>> intProperty,
                                                      int searchValue)
        {
            if (searchValue == 0)
            {
                return query;
            }

            var searchTermExpression = Expression.Constant(searchValue);
            MethodInfo method = typeof(int).GetMethod("Equals", new[] { typeof(int) });
            var checkEqualsExpression = Expression.Call(intProperty.Body, method, searchTermExpression);
            Expression<Func<T, bool>> lambda = Expression.Lambda<Func<T, bool>>(checkEqualsExpression,
               intProperty.Parameters);
            //Build final expression
            var methodCallExpression = Expression.Call(typeof(Queryable),
                                                       "Where",
                                                       new Type[] { query.ElementType },
                                                       query.Expression,
                                                       lambda.Expand());

            return query.Provider.CreateQuery<T>(methodCallExpression);
        }

        /// <summary>
        /// To check whether the property string value contains the search term
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="query"></param>
        /// <param name="dateProperty"></param>
        /// <param name="searchDate"></param>
        /// <returns></returns>
        public static IQueryable<T> WhereDateEquals<T>(this IQueryable<T> query,
                                                      Expression<Func<T, DateTime?>> dateProperty,
                                                      DateTime? searchDate)
        {

            if (searchDate == null)
            {
                return query;
            }

            var isNotNullExpression = Expression.NotEqual(dateProperty.Body, Expression.Constant(null));
            //Create expression to represent T.[property].Contains(searchTerm)
            var searchTermExpression = Expression.Constant(searchDate.Value);
            var checkEqualsExpression = Expression.Call(dateProperty.Body, typeof(DateTime).GetMethod("Equals"), searchTermExpression);
            var notNullAndEqualsExpression = Expression.AndAlso(isNotNullExpression, checkEqualsExpression);
            //Build final expression
            Expression<Func<T, bool>> lambda =
               Expression.Lambda<Func<T, bool>>(notNullAndEqualsExpression, dateProperty.Parameters);
            var methodCallExpression = Expression.Call(typeof(Queryable),
                                                       "Where",
                                                       new Type[] { query.ElementType },
                                                       query.Expression,
                                                       lambda.Expand());


            return query.Provider.CreateQuery<T>(methodCallExpression);
        }

        /// <summary>
        /// Use to search for two values in a range
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TKey"></typeparam>
        /// <param name="query"></param>
        /// <param name="keySelector"></param>
        /// <param name="low"></param>
        /// <param name="high"></param>
        /// <returns></returns>
        public static IQueryable<T> Between<T, TKey>(this IQueryable<T> query,
                                                    Expression<Func<T, TKey>> keySelector,
                                                    TKey low, TKey high) where TKey : IComparable<TKey>
        {
            switch (low.GetType().UnderlyingSystemType.Name)
            {
                case "Int32":
                    return CheckInt32Operands(query, keySelector, low, high);
                case "DateTime":
                    if (Convert.ToDateTime(low) == DateTime.MinValue && Convert.ToDateTime(high) == DateTime.MinValue)
                    {
                        return query;
                    }
                    if (Convert.ToDateTime(high) == DateTime.MinValue)
                    {
                        return GreaterThanOrEqualTo(query, keySelector, low);
                    }
                    break;
            }

            Expression key = Expression.Invoke(keySelector, keySelector.Parameters);
            Expression lowerBound = Expression.GreaterThanOrEqual(key, Expression.Constant(low));
            Expression upperBound = Expression.LessThanOrEqual(key, Expression.Constant(high));
            Expression and = Expression.AndAlso(lowerBound, upperBound);
            Expression<Func<T, bool>> lambda =
                Expression.Lambda<Func<T, bool>>(and, keySelector.Parameters);

            var methodCallExpression = Expression.Call(typeof(Queryable),
                                                       "Where",
                                                       new Type[] { query.ElementType },
                                                       query.Expression,
                                                       lambda.Expand());

            return query.Provider.CreateQuery<T>(methodCallExpression);
        }
        /// <summary>
        /// Use to search for two values in a range
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TKey"></typeparam>
        /// <param name="query"></param>
        /// <param name="keySelector"></param>
        /// <param name="low"></param>
        /// <returns></returns>
        public static IQueryable<T> GreaterThanOrEqualTo<T, TKey>(this IQueryable<T> query,
                                                    Expression<Func<T, TKey>> keySelector,
                                                    TKey low) where TKey : IComparable<TKey>
        {
            Expression key = Expression.Invoke(keySelector, keySelector.Parameters);
            Expression lowerBound = Expression.GreaterThanOrEqual(key, Expression.Constant(low));
            Expression<Func<T, bool>> lambda =
                Expression.Lambda<Func<T, bool>>(lowerBound, keySelector.Parameters);

            var methodCallExpression = Expression.Call(typeof(Queryable),
                                                       "Where",
                                                       new Type[] { query.ElementType },
                                                       query.Expression,
                                                       lambda.Expand());


            return query.Provider.CreateQuery<T>(methodCallExpression);
        }
        /// <summary>
        /// Check whether both low and high operands have values
        /// and call/return a queryable object accordingly
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <typeparam name="TKey"></typeparam>
        /// <param name="query"></param>
        /// <param name="keySelector"></param>
        /// <param name="low"></param>
        /// <param name="high"></param>
        /// <returns></returns>
        private static IQueryable<T> CheckInt32Operands<T, TKey>(IQueryable<T> query,
                                         Expression<Func<T, TKey>> keySelector,
                                          TKey low, TKey high) where TKey : IComparable<TKey>
        {
            if (Convert.ToInt32(low) == 0 && Convert.ToInt32(high) == 0)
            {
                return query;
            }
            return Convert.ToInt32(high) == 0 ? GreaterThanOrEqualTo(query, keySelector, low) : query;
        }

    }
}
