using System;
using System.Web.Mvc;
using System.Web.Security;
using Umbraco.Core;
using Umbraco.Web.Models;
using Umbraco.Web.Mvc;

namespace Umbraco.Web.Controllers // Namespace must be Umbraco.Web.Controllers for this to be picked up
{
    public class CastleRegisterController : SurfaceController
    {
        /// <summary>
        /// Registers member and assigns them to the teacher role
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult HandleRegisterTeacher([Bind(Prefix = "registerModel")]RegisterModel model)
        {
            if (ModelState.IsValid == false)
            {
                return CurrentUmbracoPage();
            }

            MembershipCreateStatus status;
            MembershipUser member = Members.RegisterMember(model, out status, model.LoginOnSuccess);

            Services.MemberService.AssignRole(member.UserName, "Teacher");

            switch (status)
            {
                case MembershipCreateStatus.Success:

                    TempData["FormSuccess"] = true;

                    //if there is a specified path to redirect to then use it
                    if (model.RedirectUrl.IsNullOrWhiteSpace() == false)
                    {
                        return Redirect(model.RedirectUrl);
                    }
                    //redirect to current page by default

                    return RedirectToCurrentUmbracoPage();
                case MembershipCreateStatus.InvalidUserName:
                    ModelState.AddModelError((model.UsernameIsEmail || model.Username == null)
                        ? "registerModel.Email"
                        : "registerModel.Username",
                        "Username is not valid");
                    break;
                case MembershipCreateStatus.InvalidPassword:
                    ModelState.AddModelError("registerModel.Password", "The password is not strong enough");
                    break;
                case MembershipCreateStatus.InvalidQuestion:
                case MembershipCreateStatus.InvalidAnswer:
                    //TODO: Support q/a http://issues.umbraco.org/issue/U4-3213
                    throw new NotImplementedException(status.ToString());
                case MembershipCreateStatus.InvalidEmail:
                    ModelState.AddModelError("registerModel.Email", "Email is invalid");
                    break;
                case MembershipCreateStatus.DuplicateUserName:
                    ModelState.AddModelError((model.UsernameIsEmail || model.Username == null)
                        ? "registerModel.Email"
                        : "registerModel.Username",
                        "A member with this username already exists.");
                    break;
                case MembershipCreateStatus.DuplicateEmail:
                    ModelState.AddModelError("registerModel.Email", "A member with this e-mail address already exists");
                    break;
                case MembershipCreateStatus.UserRejected:
                case MembershipCreateStatus.InvalidProviderUserKey:
                case MembershipCreateStatus.DuplicateProviderUserKey:
                case MembershipCreateStatus.ProviderError:
                    //don't add a field level error, just model level
                    ModelState.AddModelError("registerModel", "An error occurred creating the member: " + status);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return CurrentUmbracoPage();
        }

        /// <summary>
        /// Registers member and assigns them to the Student role
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult HandleRegisterStudent([Bind(Prefix = "registerModel")]RegisterModel model)
        {
            if (ModelState.IsValid == false)
            {
                return CurrentUmbracoPage();
            }

            MembershipCreateStatus status;
            MembershipUser member = Members.RegisterMember(model, out status, model.LoginOnSuccess);

            Services.MemberService.AssignRole(member.UserName, "Student");

            switch (status)
            {
                case MembershipCreateStatus.Success:

                    TempData["FormSuccess"] = true;

                    //if there is a specified path to redirect to then use it
                    if (model.RedirectUrl.IsNullOrWhiteSpace() == false)
                    {
                        return Redirect(model.RedirectUrl);
                    }
                    //redirect to current page by default

                    return RedirectToCurrentUmbracoPage();
                case MembershipCreateStatus.InvalidUserName:
                    ModelState.AddModelError((model.UsernameIsEmail || model.Username == null)
                        ? "registerModel.Email"
                        : "registerModel.Username",
                        "Username is not valid");
                    break;
                case MembershipCreateStatus.InvalidPassword:
                    ModelState.AddModelError("registerModel.Password", "The password is not strong enough");
                    break;
                case MembershipCreateStatus.InvalidQuestion:
                case MembershipCreateStatus.InvalidAnswer:
                    //TODO: Support q/a http://issues.umbraco.org/issue/U4-3213
                    throw new NotImplementedException(status.ToString());
                case MembershipCreateStatus.InvalidEmail:
                    ModelState.AddModelError("registerModel.Email", "Email is invalid");
                    break;
                case MembershipCreateStatus.DuplicateUserName:
                    ModelState.AddModelError((model.UsernameIsEmail || model.Username == null)
                        ? "registerModel.Email"
                        : "registerModel.Username",
                        "A member with this username already exists.");
                    break;
                case MembershipCreateStatus.DuplicateEmail:
                    ModelState.AddModelError("registerModel.Email", "A member with this e-mail address already exists");
                    break;
                case MembershipCreateStatus.UserRejected:
                case MembershipCreateStatus.InvalidProviderUserKey:
                case MembershipCreateStatus.DuplicateProviderUserKey:
                case MembershipCreateStatus.ProviderError:
                    //don't add a field level error, just model level
                    ModelState.AddModelError("registerModel", "An error occurred creating the member: " + status);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return CurrentUmbracoPage();
        }

        /// <summary>
        /// Registers member and assigns them to the Student role
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult HandleRegisterSeller([Bind(Prefix = "registerModel")]RegisterModel model)
        {

            //#region SEED VR USERS AS MEMBERS

            //IUnitOfWork unitOfWork = new VelocityRocketLegacy();
            //List<User> velocityRocketUsers = unitOfWork.With<User>().Where(c => c.UserId != null).ToList();


            //// Act - fro each create a member
            //foreach (var vrUser in velocityRocketUsers)
            //{
            //    model.Name = vrUser.FirstName + " " + vrUser.LastName;
            //    model.Email = vrUser.Email;
            //    model.MemberProperties.Clear();
            //    model.MemberProperties.Add(new UmbracoProperty
            //    {
            //        Alias = "organisationID",
            //        Value = vrUser.OrganisationId1.ToString()
            //    });

            //    model.MemberProperties.Add(new UmbracoProperty
            //    {
            //        Alias = "velocityRocketUserID",
            //        Value = vrUser.UserId
            //    });

            //    MembershipCreateStatus status;
            //    MembershipUser member = Members.RegisterMember(model, out status, model.LoginOnSuccess);

            //    if (member!=null)
            //    {
            //          Services.MemberService.AssignRole(member.UserName, "Seller");
            //    }

            //}

            //#endregion


            if (ModelState.IsValid == false)
            {
                return CurrentUmbracoPage();
            }

            MembershipCreateStatus status;
            MembershipUser member = Members.RegisterMember(model, out status, model.LoginOnSuccess);

       

            switch (status)
            {
                case MembershipCreateStatus.Success:

                    TempData["FormSuccess"] = true;
                    Services.MemberService.AssignRole(member.UserName, "Seller");
                    //if there is a specified path to redirect to then use it
                    if (model.RedirectUrl.IsNullOrWhiteSpace() == false)
                    {
                        return Redirect(model.RedirectUrl);
                    }
                    //redirect to current page by default

                    return RedirectToCurrentUmbracoPage();
                case MembershipCreateStatus.InvalidUserName:
                    ModelState.AddModelError((model.UsernameIsEmail || model.Username == null)
                        ? "registerModel.Email"
                        : "registerModel.Username",
                        "Username is not valid");
                    break;
                case MembershipCreateStatus.InvalidPassword:
                    ModelState.AddModelError("registerModel.Password", "The password is not strong enough");
                    break;
                case MembershipCreateStatus.InvalidQuestion:
                case MembershipCreateStatus.InvalidAnswer:
                    //TODO: Support q/a http://issues.umbraco.org/issue/U4-3213
                    throw new NotImplementedException(status.ToString());
                case MembershipCreateStatus.InvalidEmail:
                    ModelState.AddModelError("registerModel.Email", "Email is invalid");
                    break;
                case MembershipCreateStatus.DuplicateUserName:
                    ModelState.AddModelError((model.UsernameIsEmail || model.Username == null)
                        ? "registerModel.Email"
                        : "registerModel.Username",
                        "A member with this username already exists.");
                    break;
                case MembershipCreateStatus.DuplicateEmail:
                    ModelState.AddModelError("registerModel.Email", "A member with this e-mail address already exists");
                    break;
                case MembershipCreateStatus.UserRejected:
                case MembershipCreateStatus.InvalidProviderUserKey:
                case MembershipCreateStatus.DuplicateProviderUserKey:
                case MembershipCreateStatus.ProviderError:
                    //don't add a field level error, just model level
                    ModelState.AddModelError("registerModel", "An error occurred creating the member: " + status);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            return CurrentUmbracoPage();
        }
    }
}