using Xxx.AngularJsSolution1.Data;
using Repository.Pattern.Ef6;
using Repository.Pattern.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Repository
{
    public class DefaultRepository : IDefaultRepository
    {
        private readonly IUnitOfWorkAsync unitOfWorkAsync;
        public DefaultRepository(IUnitOfWorkAsync unitOfWorkAsync)
        {
            this.unitOfWorkAsync = new UnitOfWork(new SimpleOrderEntryContext());
        }

        public IUnitOfWorkAsync UnitOfWorkAsync
        {
            get { return unitOfWorkAsync; }

        }
    }
}
