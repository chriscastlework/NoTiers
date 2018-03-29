<xml>
	<application>
		<resources>
			<resource id="locale_strings">
				<plugins.locale.Locale>
					<string id="SAVING">Saving...</string>
					<string id="LOAD_ERROR">There was a problem loading your opportunity data. Please close this dialog to retry. If this problem persists, please ensure your internet connection is running, and your CRM session is still valid.</string>
					<string id="SAVE_ERROR">There was a problem saving your opportunity data.</string>
					<string id="SAVE_ERROR_DEFAULT_REASON"> Please ensure your internet connection is running, and your CRM session is still valid.</string>
					<string id="PROMPT_SAVE">Are you sure you want to exit without saving your changes?</string>
					<string id="DIALOG_OK">Ok</string>
					<string id="DIALOG_CANCEL">Cancel</string>
					<string id="DIALOG_CLOSE">Close</string>
					<string id="MESSAGE_DIALOG_WARNING">Warning</string>
					<string id="MESSAGE_DIALOG_ALERT">Alert!</string>
					<string id="CONFIRM_DIALOG_YES">Yes</string>
					<string id="CONFIRM_DIALOG_NO">No</string>
					<string id="MESSAGE_DIALOG_ERROR">Error!</string>
					<string id="BROWSER_REFRESHING_CRM">This%20browser%20does%20not%20support%20refreshing%20of%20the%20CRM.%20Any%20changes%20made%20in%20the%20Applet%20will%20not%20be%20displayed%20until%20you%20press%20'Command%20R'</string>
					<string id="LOSS_OF_DATA">Clicking%20OK%20could%20result%20in%20lost%20data.%20%5CnEnsure%20you%20have%20saved%20any%20changes%20before%20exiting.</string>
				</plugins.locale.Locale>
			</resource>
			<resource id="user_date">
				<format type="date">
					<value id="format">dd/mm/yy</value>
				</format>
			</resource>
			<resource id="general_date">
				<format type="date">
					<value id="format">dd/mm/yy</value>
				</format>
			</resource>
			<resource id="applicationoptions">
				<plugins.options.ApplicationOptions>
					<version>Page Viewer User Build 0.0.1</version>
					<mode>full</mode>
					<splashmessage>Applet locked</splashmessage>
					<autosave>0</autosave>
				</plugins.options.ApplicationOptions>
			</resource>
			<resource id="usersettings">
				<plugins.user.UserSettings>
					<username>Corrie Gray </username>
					<userid>5e7ab783-ac19-4b87-8771-2d614eafcc9b</userid>
					<defaultdateformat>user_date</defaultdateformat>
					<licenses>
						<license id="pv">full</license>
					</licenses>
					<language>EN</language>
				</plugins.user.UserSettings>
			</resource>
			<resource id="enabled">
			</resource>
			<resource id="fB90">Don%27t%20delete%20my%20labels%20helps%20me%20know%20whats%20what%20on%20this%20page</resource>
			<resource id="wRDs">Field%20Mapped%20To%20Deal%20Owner</resource>
			<resource id="5Ixo">Table%20Mapped%20to%20Deal%20Contacts</resource>
			<resource id="K50A">Page%20Mapped%20To%20Deal</resource>
			<resource id="nqY9">%20</resource>
			<resource id="1">true</resource>
			<resource id="2">false</resource>
			<resource id="3">1024</resource>
			<resource id="10">2048</resource>
			<resource id="11">4096</resource>
			<resource id="4">%20</resource>
			<resource id="5">%2C</resource>
			<resource id="6">3%2E14159265358979</resource>
			<resource id="7">%23FF0000</resource>
			<resource id="8">%23FF7f00</resource>
			<resource id="9">%2300FF00</resource>
			<resource id="p084">%7BFirstName%7D%20%2B%20%7BnqY9%7D%20%2B%20%7BLastName%7D</resource>
			<resource id="e9444ede">
				<selection>
					<value id=""/>
					<value id="CustomField1580">1</value>
					<value id="CustomField1581">2</value>
					<value id="CustomField1582">3</value>
				</selection>
			</resource>
			<resource id="CustomField1580">1</resource>
			<resource id="CustomField1581">2</resource>
			<resource id="CustomField1582">3</resource>
		</resources>
		<ui>
			<container  id="dialog_ASDASD">
	        <label>Name</lable>
	        <field type="text" id="Name_ASDASD"/>
            </container>
		</ui>
		<data id="main">
			<record id="Deal" >
				<field id="CrmID"/>
				<field id="RelationshipId"/>
				<field id="OwnerId"  />
				<field id="Owner"  />
				<record id="Deal" >
					<field id="CrmID"/>
					<field id="RelationshipId"/>
				</record>
				<recordset id="Contacts" linkData="%7B%22ApiPath%22%3A%22%2FDealContacts%2F%22%2C%22AddMethod%22%3A%22POST%22%2C%22DeleteMethod%22%3A%22DELETE%22%2C%22UseMethod%22%3A%22%22%2C%22Relationship%22%3A%7B%22StandardObjectType%22%3A%22%22%2C%22ParentId%22%3A%220%22%2C%22ChildId%22%3A%220%22%7D%7D">
					<record>
						<field id="CrmID"/>
						<field id="RelationshipId"/>
						<field id="ContactId"  />
						<field id="Contacts" linkData="%7B%22ApiPath%22%3A%22%2FDealContacts%2F%22%2C%22AddMethod%22%3A%22POST%22%2C%22DeleteMethod%22%3A%22DELETE%22%2C%22UseMethod%22%3A%22%22%2C%22Relationship%22%3A%7B%22StandardObjectType%22%3A%22%22%2C%22ParentId%22%3A%220%22%2C%22ChildId%22%3A%220%22%7D%7D" />
						<record id="Contact" >
							<field id="CrmID"/>
							<field id="RelationshipId"/>
							<field id="AccountId"  />
							<field id="Account"  />
							<field id="FirstName"  />
							<field id="CustomField2916"  />
							<field id="CustomField2919"  />
							<field id="CustomField2920" type="date" />
							<field id="LastName"  />
						</record>
					</record>
				</recordset>
				<recordset id="Tasks" linkData="%7B%22ApiPath%22%3A%22%2FDealTasks%2F%22%2C%22AddMethod%22%3A%22POST%22%2C%22DeleteMethod%22%3A%22DELETE%22%2C%22UseMethod%22%3A%22%22%2C%22Relationship%22%3A%7B%22StandardObjectType%22%3A%22%22%2C%22ParentId%22%3A%220%22%2C%22ChildId%22%3A%220%22%7D%7D">
					<record>
						<field id="CrmID"/>
						<field id="RelationshipId"/>
						<field id="Name"  />
						<field id="MeetingName"  />
						<field id="ChartX"  />
						<field id="CustomField2943"  />
						<field id="CustomField2945" type="boolean" />
						<field id="DueDate" type="date" />
						<field id="CustomField2877"  />
						<field id="Tasks" linkData="%7B%22ApiPath%22%3A%22%2FDealTasks%2F%22%2C%22AddMethod%22%3A%22POST%22%2C%22DeleteMethod%22%3A%22DELETE%22%2C%22UseMethod%22%3A%22%22%2C%22Relationship%22%3A%7B%22StandardObjectType%22%3A%22%22%2C%22ParentId%22%3A%220%22%2C%22ChildId%22%3A%220%22%7D%7D" />
					</record>
				</recordset>
			</record>
		</data>
	</application>
	<record id="main">
	<record id="Deal">
		<field id="OwnerId">b4a91711%2D9e98%2D476f%2Da43b%2D8acfcfe31337</field>
		<recordset id="Contacts" recordsetType="7">
			<record id="4637" recordsetType="DealContacts">
				<field id="Id">4637</field>
				<field id="ContactId">49733</field>
				<record id="Contact" recordsetType="ContactDetailViewModel">
					<field id="Id">49733</field>
					<field id="AccountId">16864</field>
					<field id="FirstName">Corrie</field>
				</record>
			</record>
			<record id="4669" recordsetType="DealContacts">
				<field id="Id">4669</field>
				<field id="ContactId">49977</field>
				<record id="Contact" recordsetType="ContactDetailViewModel">
					<field id="Id">49977</field>
					<field id="AccountId">16796</field>
					<field id="FirstName">Bob</field>
				</record>
			</record>
			<record id="4686" recordsetType="DealContacts">
				<field id="Id">4686</field>
				<field id="ContactId">50057</field>
				<record id="Contact" recordsetType="ContactDetailViewModel">
					<field id="Id">50057</field>
					<field id="AccountId"/>
					<field id="FirstName">Janice</field>
				</record>
			</record>
			<record id="4687" recordsetType="DealContacts">
				<field id="Id">4687</field>
				<field id="ContactId">50058</field>
				<record id="Contact" recordsetType="ContactDetailViewModel">
					<field id="Id">50058</field>
					<field id="AccountId"/>
					<field id="FirstName">Adam</field>
				</record>
			</record>
			<record id="5249" recordsetType="DealContacts">
				<field id="Id">5249</field>
				<field id="ContactId">49535</field>
				<record id="Contact" recordsetType="ContactDetailViewModel">
					<field id="Id">49535</field>
					<field id="AccountId">16796</field>
					<field id="FirstName">Laurie</field>
				</record>
			</record>
			<record id="5435" recordsetType="DealContacts">
				<field id="Id">5435</field>
				<field id="ContactId">50038</field>
				<record id="Contact" recordsetType="ContactDetailViewModel">
					<field id="Id">50038</field>
					<field id="AccountId"/>
					<field id="FirstName">My%20Deal</field>
				</record>
			</record>
			<record id="5436" recordsetType="DealContacts">
				<field id="Id">5436</field>
				<field id="ContactId">49536</field>
				<record id="Contact" recordsetType="ContactDetailViewModel">
					<field id="Id">49536</field>
					<field id="AccountId">16864</field>
					<field id="FirstName">Gary</field>
				</record>
			</record>
		</recordset>
		<recordset id="Tasks" recordsetType="3">
			<record id="10276" recordsetType="Task">
				<field id="CustomField2877"/>
				<field id="CustomField2943">CustomField1580</field>
				<field id="CustomField2945">True</field>
				<field id="Id">10276</field>
				<field id="Name">Politicalsad%20Me</field>
				<field id="MeetingName"/>
				<field id="ChartX">0</field>
				<field id="DueDate">10%2F10%2F2016%2010%3A58%3A36</field>
			</record>
			<record id="10365" recordsetType="Task">
				<field id="CustomField2877"/>
				<field id="CustomField2943">CustomField1580</field>
				<field id="CustomField2945">False</field>
				<field id="Id">10365</field>
				<field id="Name">Task%201%2C000%2C002%2E</field>
				<field id="MeetingName">New%20meeting%201%2A</field>
				<field id="ChartX">0</field>
				<field id="DueDate">02%2F12%2F2017%2000%3A00%3A00</field>
			</record>
			<record id="10367" recordsetType="Task">
				<field id="CustomField2877"/>
				<field id="CustomField2943">CustomField1582</field>
				<field id="CustomField2945">False</field>
				<field id="Id">10367</field>
				<field id="Name">Infoteam%20meeting</field>
				<field id="MeetingName">3</field>
				<field id="ChartX">0</field>
				<field id="DueDate">31%2F08%2F2016%2016%3A00%3A00</field>
			</record>
		</recordset>
	</record>
	</record>
</xml>