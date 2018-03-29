using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CustomLogic.Core.Database;
using CustomLogic.LegacyDatabase;

namespace SpringXBuilder.MVC.Controllers
{
    public class OrganisationsController : Controller
    {
        private VelocityRocketLegacy db = new VelocityRocketLegacy();

        // GET: Organisations
        public ActionResult Index()
        {
            var organisations = db.Organisations.Include(o => o.CreatedBy).Include(o => o.LastModifiedBy).Include(o => o.SalesTrainingCompany).Include(o => o.StcTheme).Include(o => o.Subscription);
            return View(organisations.ToList());
        }

        // GET: Organisations/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organisation organisation = db.Organisations.Find(id);
            if (organisation == null)
            {
                return HttpNotFound();
            }
            return View(organisation);
        }

        // GET: Organisations/Create
        public ActionResult Create()
        {
            ViewBag.CreatedById = new SelectList(db.Users, "UserId", "Email");
            ViewBag.LastModifiedById = new SelectList(db.Users, "UserId", "Email");
            ViewBag.IsStcId = new SelectList(db.SalesTrainingCompanies, "Id", "Name");
            ViewBag.OrganisationThemeId = new SelectList(db.StcThemes, "Id", "NavBarBackgroundColour");
            ViewBag.SubscriptionId = new SelectList(db.Subscriptions, "Id", "BillingCurrency");
            return View();
        }

        // POST: Organisations/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include = "Id,Name,BillingCurrency,SubscriptionId,BraintreeCustomerId,IsGlobalPermissions,DateCreated,DateLastModeified,CreatedById,LastModifiedById,AllowMultipleDealContactRoles,DefaultOrgCurrency,FinacialYearEndDateTime,NewTrialNotificationEmailSent,GlobalEmailPreferences,DefaultStcId,OrganisationThemeId,HasOrganisationTheme,IsStcId,DealsLimit,LeadsLimit,ContactsLimit,PartnersLimit,AccountsLimit,TasksLimit,CustomObjectsLimit,EnableImpersonate")] Organisation organisation)
        {
            if (ModelState.IsValid)
            {
                db.Organisations.Add(organisation);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.CreatedById = new SelectList(db.Users, "UserId", "Email", organisation.CreatedById);
            ViewBag.LastModifiedById = new SelectList(db.Users, "UserId", "Email", organisation.LastModifiedById);
            ViewBag.IsStcId = new SelectList(db.SalesTrainingCompanies, "Id", "Name", organisation.IsStcId);
            ViewBag.OrganisationThemeId = new SelectList(db.StcThemes, "Id", "NavBarBackgroundColour", organisation.OrganisationThemeId);
            ViewBag.SubscriptionId = new SelectList(db.Subscriptions, "Id", "BillingCurrency", organisation.SubscriptionId);
            return View(organisation);
        }

        // GET: Organisations/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organisation organisation = db.Organisations.Find(id);
            if (organisation == null)
            {
                return HttpNotFound();
            }
            ViewBag.CreatedById = new SelectList(db.Users, "UserId", "Email", organisation.CreatedById);
            ViewBag.LastModifiedById = new SelectList(db.Users, "UserId", "Email", organisation.LastModifiedById);
            ViewBag.IsStcId = new SelectList(db.SalesTrainingCompanies, "Id", "Name", organisation.IsStcId);
            ViewBag.OrganisationThemeId = new SelectList(db.StcThemes, "Id", "NavBarBackgroundColour", organisation.OrganisationThemeId);
            ViewBag.SubscriptionId = new SelectList(db.Subscriptions, "Id", "BillingCurrency", organisation.SubscriptionId);
            return View(organisation);
        }

        // POST: Organisations/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include = "Id,Name,BillingCurrency,SubscriptionId,BraintreeCustomerId,IsGlobalPermissions,DateCreated,DateLastModeified,CreatedById,LastModifiedById,AllowMultipleDealContactRoles,DefaultOrgCurrency,FinacialYearEndDateTime,NewTrialNotificationEmailSent,GlobalEmailPreferences,DefaultStcId,OrganisationThemeId,HasOrganisationTheme,IsStcId,DealsLimit,LeadsLimit,ContactsLimit,PartnersLimit,AccountsLimit,TasksLimit,CustomObjectsLimit,EnableImpersonate")] Organisation organisation)
        {
            if (ModelState.IsValid)
            {
                db.Entry(organisation).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.CreatedById = new SelectList(db.Users, "UserId", "Email", organisation.CreatedById);
            ViewBag.LastModifiedById = new SelectList(db.Users, "UserId", "Email", organisation.LastModifiedById);
            ViewBag.IsStcId = new SelectList(db.SalesTrainingCompanies, "Id", "Name", organisation.IsStcId);
            ViewBag.OrganisationThemeId = new SelectList(db.StcThemes, "Id", "NavBarBackgroundColour", organisation.OrganisationThemeId);
            ViewBag.SubscriptionId = new SelectList(db.Subscriptions, "Id", "BillingCurrency", organisation.SubscriptionId);
            return View(organisation);
        }

        // GET: Organisations/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Organisation organisation = db.Organisations.Find(id);
            if (organisation == null)
            {
                return HttpNotFound();
            }
            return View(organisation);
        }

        // POST: Organisations/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            Organisation organisation = db.Organisations.Find(id);
            db.Organisations.Remove(organisation);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
