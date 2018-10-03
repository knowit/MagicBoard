# Module: MMM-iFrame
The `MMM-iFrame` module is for MagicMirror. It is a simple way to add an iFrame of any web content to your [MagicMirror](https://github.com/MichMich/MagicMirror).  Please note that not all websites support being in a iFrame.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
		module: 'MMM-iFrame',
		config: {
			// See 'Configuration options' for more information.
				url: ["ENTER IN URL", "ENTER IN URL2"],  // as many URLs you want or you can just ["ENTER IN URL"] if single URL.
				scrolling: "no"
		}
	}
]
````

## Configuration options

The following properties can be configured:


<table width="100%">
		<tr>
			<th>Option</th>
			<th width="100%">Description</th>
		</tr>
		<tr>
			<td><code>url</code></td>
			<td>the URL(s) in the iFrame<br>
				<br><b>Example:</b><code>["http://example.com/", "http://example2.com", "http://example3.com"]</code>
				<br><b>Default value:</b> <code>["http://magicmirror.builders/"]</code>
			</td>
		</tr>
		<tr>
			<td><code>scrolling</code></td>
			<td>scrolling on the iFrame<br>
				<br><b>Example:</b><code>"no" OR "yes"</code>
				<br><b>Default value:</b> <code>"no"</code>
			</td>
		</tr>		
</table>
