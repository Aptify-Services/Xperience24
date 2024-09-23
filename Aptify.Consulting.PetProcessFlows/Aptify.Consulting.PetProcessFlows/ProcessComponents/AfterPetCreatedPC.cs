using Aptify.Consulting.PetProcessFlows.Utilities;
using Aptify.Framework.Application;
using Aptify.Framework.BusinessLogic.GenericEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

namespace Aptify.Consulting.PetProcessFlows
{
    public class AfterPetCreatedPC : Aptify.Framework.BusinessLogic.ProcessPipeline.ProcessComponentBase
    {
        #region Globals
        protected enum ResultCodes { SUCCESS, FAILURE };
        #endregion

        #region Properties
        public AptifyGenericEntityBase GEObject { get; set; }
        public List<int> appointmentDays { get; set; }
        #endregion

        #region MainMethods
        public override void Config(AptifyApplication ApplicationObject)
        {
            base.Config(ApplicationObject);
            GEObject = (AptifyGenericEntityBase)Properties.GetProperty("GEObject");
            appointmentDays = Methods.SafeString(Properties.GetProperty("AppointmentList")).Split(',').Select(int.Parse).ToList();

            if (GEObject == null)
            {
                GEObject = Application.GetEntityObject("Pets__c", Methods.SafeLong(Properties.GetProperty("RecordID")));
            }
        }

        public override string Run()
        {
            ResultCodes ReturnedCode = ResultCodes.SUCCESS;
            AptifyGenericEntityBase singleAppointmentGE;
            try
            {
                if (GEObject != null)
                {
                    // Do work here
                    foreach (int i in appointmentDays)
                    {
                        singleAppointmentGE = Application.GetEntityObject("PetAppointments__c", -1);
                        singleAppointmentGE.SetValue("PetID", GEObject.RecordID);
                        singleAppointmentGE.SetValue("AppointmentDate", DateTime.Now.AddDays(i));
                        singleAppointmentGE.Save(false);
                    }
                }
                else
                {
                    throw new Exception("ProcessFlow: GEObject is null.");
                }
            }
            catch (Exception e)
            {
                Aptify.Framework.ExceptionManagement.ExceptionManager.Publish(e);
                ReturnedCode = ResultCodes.FAILURE;
            }

            return ReturnedCode.ToString();
        }
        #endregion

        #region HelperMethods
        /// <summary>
        /// Sample call to a stored procedure
        /// </summary>
        /// <returns>datatable with data</returns>
        private DataTable GetDataFromDatabase(int PersonID)
        {
            string SQL = "spGetDataFromDatabase__c";
            IDataParameter[] myParams = new IDataParameter[1];
            myParams[0] = DataAction.GetDataParameter("PersonID", System.Data.SqlDbType.Int, PersonID);

            return DataAction.GetDataTableParametrized(SQL, CommandType.StoredProcedure, myParams);
        }
        #endregion
    }
}