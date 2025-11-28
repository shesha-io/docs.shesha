# Date Field

The Date Field component offers users a clean, flexible way to select dates, times, or ranges. It includes support for various picker modes, time formats, and detailed validation options.

![Image](../data-entry/images/datefield1.png)

## **Properties**

The following properties are available to configure the behavior of the component from the form editor (this is in addition to [common properties](/docs/front-end-basics/form-components/common-component-properties)).


### Common

#### **Range** ``boolean``

Enable to allow selecting a range of dates instead of a single date.

#### **Placeholder** ``string``/``function``

Shows hint text inside the input to guide users on what to enter.

___


### Data

#### **Picker** ``object``

Choose the mode of the picker:

- **date *(default)***: Pick a single calendar date.

- **week**: Select a week of the year.

- **month**: Pick a specific month.

- **quarter**: Select a business quarter.

- **year**: Pick an entire year.


#### **Resolve to UTC** ``boolean``

Automatically convert the selected date and time to UTC.

#### **Show Time** ``boolean``

Enable this to allow users to select a time along with the date.

#### **Show Today/Now** ``boolean``

Display a shortcut for today’s date or the current time.

#### **Disabled Date Mode** ``boolean``

Choose a method for disabling dates:

- **None *(default)***: All dates selectable.

- **Function Template**: Use predefined templates to disable dates.

- **Custom Function**: Write custom JavaScript to decide which dates to disable.


#### **Date Format** ``string``/ ``function``

Defines the format for dates (default: ``DD/MM/YYYY``).

#### **Time Format** ``string``/ ``function``

Defines the time display format (default: ``HH:mm:ss``).

#### **Year Format** ``string``/ ``function``

Specifies the format for year selection (default: ``YYYY``).

#### **Quarter Format** ``string``/ ``function``

Sets the format for quarter picking (default: ``YYYY-\QQ``).

#### **Month Format** ``string``/ ``function``

Format used when selecting a month (default: ``YYYY-MM``).

#### **Week Format** ``string``/ ``function``

Format used when selecting a week (default: ``YYYY-wo``).

